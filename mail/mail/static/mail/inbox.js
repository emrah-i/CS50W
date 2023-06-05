
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  document.querySelector('#emails-view').addEventListener('click', function(event) {
    if (event.target.matches('div')) {
      const value = event.target.dataset.value 
      load_email(value);
    }
    else {
      const value = event.target.closest('[data-value]').dataset.value;
      load_email(value);
    }
  });


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#get-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#get-email-view').style.display = 'none';

  const emails_view = document.querySelector('#emails-view')

  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      for (let i = 0; i < emails.length; i++) {
        var newElement = document.createElement('div');
        newElement.id = 'email_' + i;
        newElement.dataset.value = emails[i]["id"];
        emails_view.append(newElement)

        const sender = emails[i]["sender"];
        const recipients = emails[i]["recipients"];
        const subject = emails[i]["subject"];
        const timestamp = emails[i]["timestamp"];
        const read = emails[i]["read"]

        if (mailbox === 'inbox') {
          document.querySelector('#email_' + i).innerHTML = `<table><tr><td class="column1"><b>${sender}</b><span>${subject}</span></td><td class="column2">${timestamp}</td></tr></table>`
        }
        else if (mailbox === 'sent') {
          document.querySelector('#email_' + i).innerHTML = `<table><tr><td class="column1"><b>${recipients}</b><span>${subject}</span></td><td class="column2">${timestamp}</td></tr></table>`
        }
  

        if (read === true) {
          document.querySelector('#email_' + i).style.backgroundColor = 'rgb(229, 232, 232)';
        }

      }
  });

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function send_email(event) {

  const to = document.querySelector('#compose-recipients').value;
  const subject_raw = document.querySelector('#compose-subject').value;
  const body_raw = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: to,
        subject: subject_raw,
        body: body_raw,
        read: 'false'
    })
  })
  .then(response => response.json())
  .then(result => {
      console.log(result);
      load_mailbox('sent');
  });

  event.preventDefault();
}

function load_email(value) {

  const email_div = document.querySelector('#get-email-view')

  fetch('/emails/' + value)
  .then(response => response.json())
  .then(email => {
      console.log(email);

      var newElement = document.createElement('div');
      newElement.id = 'current-email'
      email_div.append(newElement)

      const sender = email["sender"];
      const recipients = email["recipients"];
      const subject = email["subject"];
      const body = email["body"];
      const timestamp = email["timestamp"];

      document.querySelector('#current-email').innerHTML = `<p><b>From:</b> ${sender}</p><p><b>To:</b> ${recipients}</p><p><b>Subject:</b> ${subject}</p><p><b>Timestamp:</b>${timestamp}</b></p><button class="btn btn-sm btn-outline-primary" id="reply">Reply</button><hr><p>${body}</p>`
  });

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#get-email-view').style.display = 'block';
}
