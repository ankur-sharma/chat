# [START gae_python38_app]
# [START gae_python3_app]
from flask import Flask
import base64
import json
from flask import request
from flask_cors import CORS
from google.cloud import datastore
from datetime import datetime

class Chat:
    instance = None
    
    @classmethod
    def getinstance(cls):
        if not cls.instance:
            cls.instance = Chat()
        return cls.instance
        
        
    def __init__(self):
        self.load()
        self.ds = datastore.Client()
        
    def load(self):
        try:
            self.chat = []
            query = self.ds.query(kind='chat', order=('-ts',))
            for c in query.fetch(limit=10):
                try:
                    self.chat.append(c)
                except KeyError:
                    print("Error with result format, skipping entry.")

        except Exception as e:
            print(e)
            self.chat = [{"ts":1, "user": 'a', "chat": 'hello'}, 
                        {"ts": 2, "user": 'b', "chat": 'hi'}]
        return self.chat

        
    def add(self, msg):
        entity = datastore.Entity(key=self.ds.key('chat'))
        entity.update(msg)
        self.ds.put(entity)

    
    def clear(self):
        self.chat = []


        

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    chat = Chat.getinstance()
    q = request.args.get('q')
    q = base64.b64decode(q).decode('ascii')
    if q == 'clear':
        chat.clear()
    elif q == 'fetch':
        chat.load()
        return {'chat': chat.chat }
    elif q.startswith('chatuser='):
        user = q[9:10]
        chat.add({"ts": int(datetime.now().timestamp()*1000),
                    "user": user,
                    "chat":q[11:]})
    return {}


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
