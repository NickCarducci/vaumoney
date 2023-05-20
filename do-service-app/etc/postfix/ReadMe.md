# Mail Transfers

### postfix.org/postconf.5.html

adduser -s /sbin/nologin host
passwd host

https://blog.hostripples.com/how-to-create-email-account-in-postfix-mail-server/

useradd -s /usr/bin/nologin -m host
grep host /etc/passwd
host:x:1001:1001::/home/host:/usr/bin/nologin

https://hostingultraso.com/help/ubuntu/adding-e-mail-accounts-ubuntu

~~sudo mkdir -p /home/host/terminal.vau.money/user1~~
sudo chown -R host:host /home/host
chmod -R 700 /home/host

~~user1@terminal.vau.money terminal.vau.money/user1/~~
virtual_mailbox_base = /home/host
virtual_mailbox_maps = terminal.vau.money/$
virtual_mailbox_maps = @terminal.vau.money /home/host/terminal.vau.money/$

sudo postmap /etc/postfix/virtual_alias
sudo postfix reload

~~hash:/etc/postfix/virtual_maps~~
~~/etc/postfix/virtual_domains~~

https://serverfault.com/questions/943074/postfix-dovecot-and-catch-all

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-postfix-email-server-with-dovecot-dynamic-maildirs-and-lmtp

virtual_mailbox_domains postmap /etc/postfix/virtual_mailbox_domains

hostname/domain empty
hostname/domain empty

hash:/etc/postfix/virtual_mailbox_domains

https://workaround.org/ispmail/wheezy/virtual-domains

https://wiki1.dovecot.org/LDA/Sieve
