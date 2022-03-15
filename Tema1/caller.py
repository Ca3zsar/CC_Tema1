import queue, time, urllib.request
from threading import Thread

def perform_web_requests(address, no_workers):
    class Worker(Thread):
        def __init__(self, url):
            Thread.__init__(self)
            self.url = url
            self.results = []

        def run(self):
            i = 1
            while i<10:
                request = urllib.request.Request(self.url)
                response = urllib.request.urlopen(request)
                self.results.append(response.read())
                i += 1

    # Create workers and add tot the queue
    workers = []
    for _ in range(no_workers):
        worker = Worker(address)
        worker.start()
        workers.append(worker)
    
    for worker in workers:
        worker.join()


url = 'http://localhost:8000/get-results'
perform_web_requests(url, 10)