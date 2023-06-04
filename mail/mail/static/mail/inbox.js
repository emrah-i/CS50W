
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#compose-form').addEventListener('submit', send_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
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

  const emails_view = document.querySelector('#emails-view')

  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      for (let i = 0; i < emails.length; i++) {
        var newElement = document.createElement('div');
        newElement.id = 'email_' + i
        emails_view.append(newElement)

        const sender = emails[i]["sender"];
        const recipients = emails[i]["recipients"];
        const subject = emails[i]["subject"];
        const body = emails[i]["body"];
        const timestamp = emails[i]["timestamp"];
        const read = emails[i]["read"]

        document.querySelector('#email_' + i).innerHTML = `<p>Sender: ${sender}</p><p>Recipients: ${recipients}</p><p>Subject: ${subject}</p><p>Body: ${body}</p><p>Timestamp: ${timestamp}</p><br><hr>`

        if (read === true) {
          document.querySelector('#email_' + i).style.backgroundColor = 'lightgray';
        }

      }
  });

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function send_email(event) {

  const to = document.querySelector('#compose-recipients').value;
  // const recipients_n = to.split(',')
  const subject_raw = document.querySelector('#compose-subject').value;
  const body_raw = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: to,
        subject: subject_raw,
        body: body_raw,
        read: false
    })
  })
  .then(response => response.json())
  .then(result => {
      console.log(result);
      load_mailbox('sent');
  });

  event.preventDefault();
}