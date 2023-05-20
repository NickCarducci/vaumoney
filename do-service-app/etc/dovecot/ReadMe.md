# Mail delivery

### doc.dovecot.org/configuration_manual/service_configuration/

```
service auth {
  unix_listener auth-userdb {
    mode = 0600
    user = host # User running dovecot-lda
    #group = host # Or alternatively mode 0660 + dovecot-lda user in this group
  }
}
```

Mail directory under home

/var/vmail/domain/user/mail/

https://doc.dovecot.org/configuration_manual/home_directories_for_virtual_users/

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-postfix-email-server-with-dovecot-dynamic-maildirs-and-lmtp

https://wiki2.dovecot.org/LDA/Postfix

https://doc.dovecot.org/configuration_manual/sieve/extensions/variables/#pigeonhole-extension-variables

https://doc.dovecot.org/configuration_manual/protocols/lda/

https://github.com/dovecot/core/blob/main/doc/example-config/conf.d/15-lda.conf

```
protocol lda {
log_path = /var/log/dovecot-lda-errors.log
info_log_path = /var/log/dovecot-lda.log
} # then chown 600 or whatever
```

https://doc.dovecot.org/configuration_manual/sieve/examples/

https://p5r.uk/blog/2011/sieve-tutorial.html

> The <name> part is extracted from the address using variables extension.
> require ["variables", "envelope", "fileinto", "subaddress"];

https://doc.dovecot.org/configuration_manual/sieve/configuration/

https://workaround.org/ispmail/stretch/setting-up-dovecot
