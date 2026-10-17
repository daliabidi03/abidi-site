"""Turn dist-single/index.html into a body fragment for a claude.ai artifact (the viewer adds its own <html>/<head>)."""
import re, sys
src = open(sys.argv[1], encoding='utf-8').read()
head = re.search(r'<head>(.*?)</head>', src, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', src, re.S).group(1)
title = re.search(r'<title>.*?</title>', head, re.S).group(0)
head = head.replace(title, '')
head = re.sub(r'<meta charset[^>]*>|<meta name="viewport"[^>]*>|<meta name="claude:viewport-fit-sides"[^>]*>', '', head)
out = title + '\n<meta name="claude:viewport-fit-sides" content="cover">\n' + head.strip() + '\n' + body.strip() + '\n'
open(sys.argv[2], 'w', encoding='utf-8').write(out)
print(len(out))
