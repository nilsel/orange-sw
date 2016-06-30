#!/usr/local/bin/python 

import SimpleHTTPServer
import SocketServer
import mimetypes

PORT = 5000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

Handler.extensions_map['.svg']='image/svg+xml'
Handler.extensions_map['.json']='application/manifest+json'

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()

