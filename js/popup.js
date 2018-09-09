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
        var subj_display = document.getElementById("subj-display");
        var debug_display = document.getElementById("debug-display");

        var clickbait_prompt = document.getElementById("clickbait-prompt");
        var profile_prompt = document.getElementById("profile-prompt");

        var claimReview_display = document.getElementById("claimReviewDisplay");

        domain_display.innerHTML = page_domain;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://35.185.181.66:5000/predict?article_url=' + tab.url.toString(), true);
        xhr.onload = function () {
            var json = JSON.parse(this.responseText);
            debug_display.innerHTML = this.responseText;

            title_display.innerHTML = json.article_title;


            // claimReview
            var claimReview = json.claimReview;
            var num_claimReview = claimReview.titles.length;
            var claimReview_listing = "";
            if (num_claimReview > 0) {
                claimReview_display.style.display = '';
                var i;
                claimReview_listing = ""
                for (i = 0; i < num_claimReview; i++) {
                    claimReview_listing += "<h6 class='card-title'>" + claimReview.titles[i] + "</h6>";
                    if (claimReview.verdicts[i] == "True" || claimReview.verdicts[i] == "Mostly True" || claimReview.verdicts[i] == "Half True") {
                        claimReview_listing += '<p class="card-subtitle mb-2"><span class="badge badge-pill badge-success">VERDICT: ' + claimReview.verdicts[i] + '</span> <b>' + claimReview.authors[i] + "</b> <span class = 'text-muted'>" + claimReview.dates[i] + "</span></p>";
                    } else {
                        claimReview_listing += '<p class="card-subtitle mb-2"><span class="badge badge-pill badge-danger">VERDICT: ' + claimReview.verdicts[i] + '</span> <b>' + claimReview.authors[i] + "</b> <span class = 'text-muted'>" + claimReview.dates[i] + "</span></p>";
                    }
                    claimReview_listing += '<a href="' + claimReview.urls[i] + '" class="card-link" target="_blank">View Fact Check</a>';
                    if (i < num_claimReview - 1) {
                        claimReview_listing += '<hr>'
                    }
                }
            } else {
                claimReview_display.style.display = 'none';
                claimReview_display.innerHTML = "";
            }
            claimReview_display.innerHTML = claimReview_listing;


            // clickbait
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

            // article style (profile)
            profile_display.innerHTML = json.article_profile;
            if (json.article_profile == "unreliable" || json.article_profile == "fake" || json.article_profile == "junk science" || json.article_profile == "hate") {
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
                if (json.article_profile == "conspiracy" || json.article_profile == "opinion piece" || json.article_profile == "state" || json.article_profile == "political" || json.article_profile == "clickbait") {
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

            // article subjectivity
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