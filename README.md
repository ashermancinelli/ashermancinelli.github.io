## ashermancinelli.github.io

[Personal website for loosely associated blog posts.](https://ashermancinelli.github.io)

## Personal Notes

To deploy:
```console
$ export DEPLOYDIR=...
$ jekyll build -d $DEPLOYDIR
$ cp ./CNAME $DEPLOYDIR
$ cd $DEPLOYDIR && git add . && git push origin gh-pages
```
