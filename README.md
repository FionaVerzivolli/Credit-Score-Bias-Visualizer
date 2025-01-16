# Equalizer: Bias Analysis in Credit Scores

## Inspiration
The inspiration for this project stemmed from the pressing issue of implicit bias, particularly in financial systems, and its disproportionate impact on communities like African Americans. We aimed to address this challenge by creating a tool that highlights how factors like race, gender, and age can contribute to disparities in credit scoring. Our mission is to empower businesses and organizations to recognize and mitigate these biases, fostering equity and fairness.

## What It Does
Equalizer is a tool designed to detect and analyze bias in credit scores. It enables businesses to upload datasets and assess them for:
- **False positives**
- **Demographic parity**
- **Group disparity**

Users can filter data by attributes such as race and gender, visualize the results through charts, and generate detailed reports. Each dataset is scored against a bias threshold, and the results can be stored as snapshots. This feature allows users to track changes in bias over time, helping organizations monitor their progress toward fairness. Equalizer also supports multiple dataset uploads, enabling comprehensive analysis.

![image](https://github.com/user-attachments/assets/f061355b-ffe0-4c4e-96d1-4a52ef86ce74)

## How We Built It
We built Equalizer using the following technologies:
- **Frontend:** React.js for the user interface, ensuring a seamless and intuitive experience.
- **Backend:** Python and Flask for processing datasets, running bias detection algorithms, and handling API requests.
- **Database:** Firebase for storing user accounts and dataset snapshots.
- **Hosting:** The application is hosted on PythonAnywhere for reliable access.
- **Authentication:** Auth0 for secure user login and account management.

The workflow involves uploading datasets through the React frontend, which are then processed by Python algorithms in the backend. Results are visualized using Chart.js, reports are generated, and snapshots are saved in the database for future reference, so users can assess whether their service or product has improved. Each user has their own account registered using Auth0 where they can store the snapshots. Flask is used to link the frontend and backend together, and PythonAnywhere is used for deployment,

## What’s Next for Equalizer
We envision several enhancements to make Equalizer even more impactful:
- **Sharing Results:** Adding features to export and share analysis results in formats like CSV or PDF, or via sharable links.
- **Improved Visualizations:** Introducing interactive charts with features like drill-downs, tooltips, and customization options.
- **Advanced Analytics:** Enabling deeper insights through advanced filters, dataset comparisons, and tailored reporting.
- **Community Impact:** Collaborating with organizations to deploy Equalizer as a tool for promoting diversity, equity, and inclusion.

Equalizer is just the beginning of our journey toward addressing systemic bias. We are committed to refining and expanding this tool to create meaningful change.
