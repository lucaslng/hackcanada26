# Service Canada Online

## Inspiration

Canadians are **TIRED** of Service Canada's notorious wait times. For most Canadians, a visit to Service Canada almost always means a multi-hour wait. It doesn't have to be like this. We've built a system on top of Service Canada to **eliminate** physical wait times and **expedite** government services.

Introducing Service Canada, remade.

## What it does

Our website allows Canadians to submit forms for different services online. These could range from passport renewals to name changes. To prevent identity fraud, we use artificial intelligence to perform a **similarity check** between an identification document and a webcam selfie. After verifying your identity, users can easily access required documents to fill out and submit to Service Canada. As uploaded images may have an improper size, aspect ratio, be blurry, or have glare from lights we used Cloudinary to **transform and optimize images** for verification and review.

## How we built it

The website is built using React and Vite. We used face-api.js for the face verification and Cloudinary to process images.

## Challenges and Accomplishments

Should this ever become an official government service, **accessibility** across languages is non-negotiable. That's why our website has translations for 11 of the most common languages in Canada.

We deliberately modeled our design after official Canadian government websites, easing the transition for Canadians already familiar with them. The challenge was striking a balance between the familiarity of existing government interfaces and a more modern, intuitive experience.

## What we learned

This is the first time we've ever **internationalized** a project!

## What's next for Service Canada

Maybe a government contract? 🙏🙏🙏
