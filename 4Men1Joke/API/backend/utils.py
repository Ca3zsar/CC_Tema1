import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random

def generateVerificationCode():
    codes = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    verificationCode = ''
    verificationCodeLen = 6

    for i in range(verificationCodeLen):
        index = random.randint(0, len(codes)-1)
        verificationCode += codes[index]

    return verificationCode

def sendEmail(receiver_email,verificationCode):
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    sender_email = "4man1joke@gmail.com"
    password = "as!fsdcxz31232"

    message = MIMEMultipart("alternative")
    message["Subject"] = "4man1joke"
    message["From"] = sender_email
    message["To"] = receiver_email


    html = f"""\
    <html>
      <body>
        <p>Hi,<br>
           Your verification code is:<br>
           <b>{verificationCode}</b> 
        </p>
      </body>
    </html>
    """

    email_text = MIMEText(html, "html")

    message.attach(email_text)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )