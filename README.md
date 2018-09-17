# Fake News Chrome Extension
Chrome Extension to help fight Online Misinformation

## Objective

To create a tool that can assist members of the public to be more vigilant in the face of online misinformation. To that end, we are developing a Chrome extension that can:

* Evaluate the quality of an article
* Alert the user of clickbait or subjective content
* Suggest related fact-check ["ClaimReview" articles](https://www.datacommons.org/docs/faq.html#0)

## Examples

### Fact Checking

* Here's an article on Trump
  ![screenshot](readme_imgs/screenshot_6.png)

* Clicking on "View Fact Check" brings you to
  ![screenshot](screenshot_5.png)

**Other examples**

* ![screenshot](readme_imgs/screenshot_4.png)
* ![screenshot](readme_imgs/screenshot_3.png)

### Article Quality

* ![screenshot](readme_imgs/screenshot_2.png)
* ![screenshot](readme_imgs/screenshot_1.png)

Many Singapore fact-checks, even those that are on Snopes, are **not in the DataCommons** database.

## Technology Stack

Backend Endpoint API: 

* Python 3
* Flask + Gunicorn for serving
* Keras and TensorFlow-MKL for AI/DL inference

Threading and Batching is used to speed up inference on an Intel Skylake SP running on Google Cloud Compute Engine. A typical page takes 1 second for inference with the 3 NLP models we currently have in place.

[GitHub repository for the backend.](https://github.com/tlkh/fake-news-web-api)

Chrome Extension:
Chrome Extension API, Bootstrap 4, JavaScript