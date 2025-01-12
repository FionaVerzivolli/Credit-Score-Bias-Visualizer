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

The workflow involves uploading datasets through the React frontend, which are then processed by Python algorithms in the backend. Results are visualized, reports are generated, and snapshots are saved in the database for future reference.

![image](https://github.com/user-attachments/assets/fa0d9896-ed53-4062-9ee1-ce2a88488cb2)

## Challenges We Faced
Building Equalizer was not without its challenges:
- **Time Constraints:** Completing the project within a limited timeframe required efficient planning and execution.
- **Technical Hurdles:** Integrating unfamiliar technologies and troubleshooting issues with third-party APIs was a significant learning curve.
- **Optimizing User Experience:** Designing a user-friendly interface that is both functional and aesthetically pleasing was a rewarding but challenging task.

## Accomplishments We’re Proud Of
- **Embracing New Technologies:** We successfully leveraged tools and frameworks we hadn’t used before, gaining valuable experience.
- **Integration of APIs:** Seamlessly connecting third-party services and ensuring smooth communication between components.
- **User-Centric Design:** Creating an intuitive and visually appealing interface to enhance the user experience.
- **Resilience:** Overcoming unexpected roadblocks, including debugging complex errors and adapting to technology limitations.

![image](https://github.com/user-attachments/assets/03ae0c15-08a6-4a47-be28-7390b4349a12)

## What We Learned
This project taught us how to:
- Collaborate effectively under tight deadlines.
- Work with online databases to improve user experience.
- Deploy and maintain web applications, gaining insights into hosting and scalability considerations.
- Recognize and address implicit biases through data analysis.
  
![image](https://github.com/user-attachments/assets/a22e5c1f-b0ec-4a40-afa1-b14441090e0f)

## What’s Next for Equalizer
We envision several enhancements to make Equalizer even more impactful:
- **Sharing Results:** Adding features to export and share analysis results in formats like CSV or PDF, or via sharable links.
- **Improved Visualizations:** Introducing interactive charts with features like drill-downs, tooltips, and customization options.
- **Advanced Analytics:** Enabling deeper insights through advanced filters, dataset comparisons, and tailored reporting.
- **Community Impact:** Collaborating with organizations to deploy Equalizer as a tool for promoting diversity, equity, and inclusion.

Equalizer is just the beginning of our journey toward addressing systemic bias. We are committed to refining and expanding this tool to create meaningful change.
