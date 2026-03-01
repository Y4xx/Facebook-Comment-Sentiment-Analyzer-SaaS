# Facebook Graph API Integration

This document explains how to set up and use the Facebook Graph API integration for fetching comments from Facebook posts.

## Overview

The Facebook Comment Sentiment Analyzer uses the Facebook Graph API to fetch comments from Facebook posts and reels. The application then analyzes the sentiment of these comments using a BERT-based multilingual sentiment analysis model.

## Prerequisites

1. **Facebook Developer Account**: Create a developer account at [developers.facebook.com](https://developers.facebook.com)
2. **Facebook App**: Create a new app in the Facebook Developer Console
3. **Access Token**: Generate an access token with the required permissions

## Getting a Facebook Access Token

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in the app details and create the app

### Step 2: Get an Access Token

For development/testing purposes:

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Grant the required permissions:
   - `pages_read_engagement` - To read comments on page posts
   - `pages_read_user_content` - To read user comments on page posts

For production:

1. Implement Facebook Login in your application
2. Request the necessary permissions from users
3. Use the User Access Token or Page Access Token

### Step 3: Configure Environment Variables

Add your access token to the environment:

```bash
# In backend/.env
FACEBOOK_ACCESS_TOKEN=your_access_token_here
FACEBOOK_API_VERSION=v19.0
```

## Supported URL Formats

The application supports the following Facebook URL formats:

| URL Format | Example |
|------------|---------|
| Short share URL (posts) | `https://web.facebook.com/share/p/1AxW47x5b2/` |
| Short share URL (reels) | `https://web.facebook.com/share/r/1DVe2AfBDR/` |
| Standard post URL | `https://facebook.com/username/posts/123456789` |
| Video URL | `https://facebook.com/username/videos/123456789` |
| Story URL | `https://facebook.com/story.php?story_fbid=123456789` |
| Permalink | `https://facebook.com/permalink.php?story_fbid=123456789` |
| fb.watch | `https://fb.watch/abcdef/` |
| Photo URL | `https://facebook.com/username/photos/a.123/456789` |

## API Endpoint

### Analyze Post

```
POST /api/analyses
```

**Request Body:**
```json
{
  "facebook_post_url": "https://web.facebook.com/share/p/1AxW47x5b2/"
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "post_url": "https://web.facebook.com/share/p/1AxW47x5b2/",
  "overall_sentiment": "positive",
  "overall_score": 3.8,
  "positive_count": 45,
  "neutral_count": 20,
  "negative_count": 5,
  "total_comments": 70,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "detail": "Facebook access token is not configured. Please set FACEBOOK_ACCESS_TOKEN in your environment variables."
}
```

## Error Handling

The API returns the following HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 201 | Analysis created successfully |
| 400 | Bad request (missing token, invalid URL, or API error) |
| 500 | Internal server error |

Common error messages:

- **"Facebook access token is not configured"** - Set the `FACEBOOK_ACCESS_TOKEN` environment variable
- **"Facebook API error: ..."** - The Facebook API returned an error (e.g., invalid token, rate limit exceeded, or insufficient permissions)

## Rate Limiting

The Facebook Graph API has rate limiting. For details, see [Facebook Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/).

The application handles pagination automatically by following the `paging.next` URL in API responses.

## Troubleshooting

### Invalid Access Token

If you receive an "Invalid OAuth access token" error:
1. Check that your access token is correctly set in the environment
2. Verify that the token has not expired
3. Generate a new token if necessary

### Insufficient Permissions

If you receive a permissions error:
1. Ensure your app has the required permissions
2. For page posts, make sure you have a Page Access Token with proper permissions

### Rate Limit Exceeded

If you hit rate limits:
1. Wait for the rate limit window to reset
2. Consider implementing caching for frequently accessed posts
3. Use long-lived tokens to avoid frequent re-authentication

## Security Best Practices

1. **Never commit access tokens** to version control
2. Use environment variables or secure secret management
3. Use short-lived tokens in development and long-lived tokens in production
4. Regularly rotate access tokens
5. Monitor API usage for unusual activity
