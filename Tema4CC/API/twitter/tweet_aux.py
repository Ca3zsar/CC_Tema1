import tweepy
from tweepy import OAuthHandler

consumer_key= "bjwS92ahc2xhxnkGJwN2vCM0k"
consumer_key_secret= "5dQvVffnPUBjFjVWNblYyIvaKT9UoAdo9cVHjcwECJErtOxhyH"
access_token= "1229890542152167427-sdU4U8bRcwIhiD2ThWdWfSCIAntZ0b"
access_token_secret= "NfyFMCjIhWVIkNz3llZJ1FQXUJsZRCAOhl3G3Y6PgSfaq"

def auth():
    auth = OAuthHandler(consumer_key, consumer_key_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth, wait_on_rate_limit=True)
    return api

api = auth()

def getTweetsByHashtag(hashtag):

    tweets = tweepy.Cursor(api.search_tweets, q=hashtag, lang="en", tweet_mode='extended').items(10)

    list_tweets = [tweet for tweet in tweets]
    tweets_list = []
    for tweet in list_tweets:
        tweet_dict = {
            'username': tweet.user.screen_name,
            'location': tweet.user.location,
            'following': tweet.user.friends_count,
            'followers': tweet.user.followers_count,
            'tweet' : tweet.full_text,
            'date_time_posted': str(tweet.created_at),
            'retweetcount' : tweet.retweet_count,
            'hashtags' : tweet.entities['hashtags']
        }

        tweets_list.append(tweet_dict)
    return tweets_list