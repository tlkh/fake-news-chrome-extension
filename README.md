# Fake News Chrome Extension
Chrome Extension to help fight Online Misinformation

## Objective

To create a tool that can assist members of the public to be more vigilant in the face of online misinformation. To that end, we are developing a Chrome extension that can:

* Evaluate the quality of an article
* Alert the user of clickbait, subjective or "toxic" content
* Suggest related fact-check ["ClaimReview" articles](https://www.datacommons.org/docs/faq.html#0)

### When it works

![screenshot](readme_imgs/screenshot_6.png)
![screenshot](readme_imgs/screenshot_5.png)
![screenshot](readme_imgs/screenshot_8.png)
![screenshot](readme_imgs/screenshot_9.png)
![screenshot](readme_imgs/screenshot_10.png)
![screenshot](readme_imgs/screenshot_2.png)

We are not biased towards "official" media
![screenshot](readme_imgs/screenshot_3.png)

It was hard to find "toxic" content, so here is a Reddit post as an example
![screenshot](readme_imgs/screenshot_1.png)

### When it doesn't work

![screenshot](readme_imgs/screenshot_4.png) 

![screenshot](readme_imgs/screenshot_7.png)


## Technology Stack

Backend Endpoint API: 

* Python 3
* Flask + Gunicorn for serving
* Keras and TensorFlow-MKL for AI/DL inference

Threading and Batching is used to speed up inference on an Intel Skylake SP running on Google Cloud Compute Engine. A typical page takes 4 seconds for inference with the 4 NLP models we currently have in place.

[GitHub repository for the backend.](https://github.com/tlkh/fake-news-web-api)

Chrome Extension:
Chrome Extension API, Bootstrap 4, JavaScript