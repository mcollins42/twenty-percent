from google.appengine.api import users

import cgi
import webapp2


class MainPage(webapp2.RequestHandler):

    def get(self):
        # Checks for active Google account session
        user = users.get_current_user()

        if user:
            self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
            self.response.write('Hello, ' + user.nickname() + '<br>')
            self.response.write('You said: ' + cgi.escape(self.request.get('say')) + '<br>')

        else:
            #self.redirect(users.create_login_url(self.request.uri))
            self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
            self.response.write('Hello, Anonymous')
            
class LoggedIn(webapp2.RequestHandler):

    def get(self):
        # Checks for active Google account session
        user = users.get_current_user()

        if user:
            self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
            self.response.write('Hello, ' + user.nickname() + '<br>')
            self.response.write('You said: ' + cgi.escape(self.request.get('say')) + '<br>')

        else:
            self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
            self.response.write('You shouldn\'t be here')


app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/loggedin', LoggedIn),
], debug=True)

