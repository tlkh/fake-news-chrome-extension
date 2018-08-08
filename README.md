# fake-news-chrome-extension
Chrome Extension to help fight Online Misinformation

![screenshot](readme_imgs/screenshot_6.png)
![screenshot](readme_imgs/screenshot_7.png)
![screenshot](readme_imgs/screenshot_8.png)
![screenshot](readme_imgs/screenshot_9.png)
![screenshot](readme_imgs/screenshot_1.png)
![screenshot](readme_imgs/screenshot_2.png)
![screenshot](readme_imgs/screenshot_3.png)
![screenshot](readme_imgs/screenshot_5.png)
![screenshot](readme_imgs/screenshot_4.png)


## Technology Stack

Backend Endpoint API: 
Python 3: Flask (serving), Keras and TensorFlow-MKL

Threading and Batching is used to speed up inference on an Intel Skylake SP. A typical page takes 4 seconds for inference with the 4 NLP models we currently have in place.

Chrome Extension:
Chrome Extension API, Bootstrap 4, JavaScript