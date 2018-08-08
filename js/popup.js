function check_title(title) {
    title = title.toString().replace(/\s+/g, ' ').trim();
    var title_display = document.getElementById("title-display");

    title_display.innerHTML = title.toString();
}

function extract_hostname(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.hostname;
}

document.addEventListener('DOMContentLoaded', function () {
    this.clickbait_display = document.getElementById('clickbait-display');
    chrome.tabs.query({
        active: true
    }, function (tabs) {

        var tab = tabs[0];
        var page_domain = extract_hostname(tab.url.toString());

        var title_display = document.getElementById("title-display");
        var domain_display = document.getElementById("domain-display");
        var clickbait_display = document.getElementById("clickbait-display");
        var profile_display = document.getElementById("profile-display");
        var toxic_display = document.getElementById("toxic-display")
        var subj_display = document.getElementById("subj-display")
        var debug_display = document.getElementById("debug-display");

        var clickbait_prompt = document.getElementById("clickbait-prompt")
        var profile_prompt = document.getElementById("profile-prompt")

        domain_display.innerHTML = page_domain;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://35.185.181.66:5000/predict?article_url=' + tab.url.toString(), true);
        xhr.onload = function () {
            var json = JSON.parse(this.responseText);
            debug_display.innerHTML = this.responseText;

            title_display.innerHTML = json.article_title;

            clickbait_display.innerHTML = json.clickbait;
            if (json.clickbait == "clickbait") {
                clickbait_prompt.innerHTML = "Headline appears to be written to attract more views"
                try {
                    clickbait_display.classList.remove("badge-success");
                } catch (err) {
                    console.log(err)
                } finally {
                    clickbait_display.classList.add("badge-danger");
                }
            } else {
                clickbait_prompt.innerHTML = "Headline does not appear to sensationalise the news"
                try {
                    clickbait_display.classList.remove("badge-danger");
                } catch (err) {
                    console.log(err)
                } finally {
                    clickbait_display.classList.add("badge-success");
                }
            }

            profile_display.innerHTML = json.article_profile;
            // ["fake", "satire", "bias", "conspiracy", "state", "junksci", "hate", "clickbait", "unreliable", "political", "reliable"]
            if (json.article_profile == "unreliable" || json.article_profile == "fake" || json.article_profile == "junksci" || json.article_profile == "hate") {
                try {
                    profile_display.classList.remove("badge-success");
                    profile_display.classList.remove("badge-warning");
                } catch (err) {
                    console.log(err)
                } finally {
                    profile_display.classList.add("badge-danger");
                    profile_prompt.innerHTML = "Article writing style matches: " + json.article_profile.toString(); + "<br><b>Please verify facts presented</b>"
                }
            } else {
                if (json.article_profile == "conspiracy" || json.article_profile == "bias" || json.article_profile == "state" || json.article_profile == "political" || json.article_profile == "clickbait") {
                    try {
                        profile_display.classList.remove("badge-danger");
                        profile_display.classList.remove("badge-success");
                    } catch (err) {
                        console.log(err)
                    } finally {
                        profile_display.classList.add("badge-warning");
                        profile_prompt.innerHTML = "<b>Exercise discretion and fact-check dubious claims</b>"
                    }
                } else {
                    try {
                        profile_display.classList.remove("badge-warning");
                        profile_display.classList.remove("badge-danger");
                    } catch (err) {
                        console.log(err)
                    } finally {
                        profile_display.classList.add("badge-success");
                        profile_prompt.innerHTML = "Article appears to be written in a reliable manner"
                    }
                }
            }

            var bool = json.article_toxic.indexOf("none");
            if (bool < 0 || json.article_toxic.length > 1) {
                var index = json.article_toxic.indexOf("none");
                if (index > -1) {
                    json.article_toxic.splice(index, 1);
                }
                toxic_display.style.display = '';
                toxic_display.innerHTML = json.article_toxic.join(", ");
                toxic_display.classList.add("badge-danger");
                profile_prompt.innerHTML = profile_prompt.innerHTML.toString() + "<br><b>Hateful content detected</b>"
            } else {
                toxic_display.style.display = 'none';
                toxic_display.classList.remove("badge-danger");
            }

            var subj_scores = json.article_subjectivity
            if (subj_scores[0] < subj_scores[1]) {
                //  objective < subjective
                try {
                    subj_display.classList.remove("badge-success")
                } catch (err) {
                    console.log(err)
                } finally {
                    subj_display.classList.add("badge-warning");
                    subj_display.innerHTML = "subjective"
                    profile_prompt.innerHTML = profile_prompt.innerHTML.toString() + "<br>Article is not objective"
                }
            } else {
                try {
                    subj_display.classList.remove("badge-warning")
                } catch (err) {
                    console.log(err)
                } finally {
                    subj_display.classList.add("badge-success");
                    subj_display.innerHTML = "objective"
                    profile_prompt.innerHTML = profile_prompt.innerHTML.toString() + "<br>Writing is objective"
                }
            }

        };
        xhr.send();
    });

});