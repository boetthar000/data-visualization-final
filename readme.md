#formatting is clean on the drive, screenshots are also visible on the drive
drive link: https://docs.google.com/document/d/1Z3oiNew77J1pgke8mD_-wWTOsgzZlk1hlRRqAJo8b7U/edit?usp=sharing
Title + names of group members
Global Development Cellular Usage Statistics
Rani Sumedha Gilla, rgilla@asu.edu, 1218388470
Harrison Boettner, hboettne@asu.edu, 1216528456
Shiling Dai, sdai17@asu.edu, 1216514442
Overview:
A teaser image of your system. The image file should be named thumbnail.png of size 1280 x 720 px.
A concise summary of your project (max 250 words).
Our project shows the correlation between different countries and the increase and decrease in mobile cellular subscriptions in relation to death rates, birth rate, fertility rates, life expectancy rates, and population rates throughout the years. There are multiple different visual representations of the data which allow you to view the desired correlations.
Data description
Describe your final dataset(s) in terms of domain-specific and abstract language.
What type of dataset is it?
Our final dataset is a structured, temporal, and cross-sectional collection of global development indicators. It encapsulates quantitative metrics in domain-specific areas like public health, telecommunication, agriculture, and urbanization across multiple countries. It's a multi-dimensional dataset offering a time-series analysis capability, providing a complex understanding of developmental progress and trends at both national and international scales over a span of more than three decades.
What attributes did you use? What are their types, scales, cardinalities?
Mobile Cellular Subscriptions (Float): The number of mobile phone subscriptions.
Birth Rate (Float): The annual number of births per 1,000 people.
Death Rate (Float): The annual number of deaths per 1,000 people.
Fertility Rate (Float): Average number of children born to a woman.
Life Expectancy (Float): Average number of years to be lived by a newborn.
Total Population (Float): The total number of people.
If the data is preprocessed (ie, you derived new attributes), describe what you did. (A figure may optionally be included.)
Certain regions were not countries so we manually went through and selected only to use actual countries.
If the dataset is not included in the GitHub repository, this description should tell us how to include it.
The dataset is included in the github repository
Include a URL to the source of the dataset.
URL: https://corgis-edu.github.io/corgis/csv/global_development/
Goals and Tasks
Describe the intended tasks of your project in domain-specific and abstract language.
In our project, we aimed to explore the correlation between technological advancement, represented by mobile cellular subscriptions, and key demographic indicators like birth and death rates, fertility, life expectancy, and population dynamics. Our task was to analyze temporal data patterns, identify trends and anomalies, and draw insights on the relationship between technology and demographic changes in various countries over a substantial time period.
Idioms
Succinctly describe the interface that you have built.
The interface we have built allows users to view data regarding the mobile cellular subscriptions in relation to countries, years, and population based filters.
What are the implemented visualizations and what do they allow a user to do?
For each visualization, describe the encoding choices and your rationale for the design decisions.
Beeswarm:
- Encoding: Positions represent individual data points, color for categories.
- Rationale: Clearly displays distribution of data points, highlights clustering or outliers, and illustrates density.
Beeswarm + Heatmap:
- Encoding: Positions for data points, color intensity for an additional variable.
- Rationale: Combines spatial distribution with a secondary metric, enhancing depth of data interpretation.
Bar Charts:
- Encoding: Length of bars for quantitative values, color for categories.
- Rationale: Effective for comparing quantities across categories, easy to interpret.
Line Graph:
- Encoding: Points connected by lines over time, different colors for separate lines.
- Rationale: Ideal for showing trends over time, allows for easy comparison between multiple time-series data.
Pie Charts:
- Encoding: Angular size of pie slices to represent proportions, different colors for each slice.
- Rationale: Intuitive for showing composition of a whole, best for a small number of categories.
Area Charts:
- Encoding: Filled areas under the line, color differentiating between categories.
- Rationale: Useful for showing cumulative effect over time and comparing multiple categories, emphasizing volume.
What are the interactions?
	The interactions we enable allow the users to select from a dropdown for the generic beeswarm and the unique beeswarm heatmap.
How are the views linked?
	The views are linked because we are able to see the different correlations of how the increase and decrease in mobile cellular subscriptions changes the birth rates, death rates, fertility rates, life expectancy rates, and population rates of the different countries throughout the years. 
What algorithms are necessary to support your idioms?
	To support the idioms in our visualizations, several algorithms are necessary:
Data Filtering and Sorting: To manage user selections and organize data.
Statistical Algorithms: For calculating aggregates like averages or percentiles in beeswarm plots and heatmaps.
Rendering: To update visualizations in response to user interactions.
Clustering Algorithms: In beeswarm plots to efficiently position overlapping data points.
Include screenshots detailing  the idioms in this section, to help the reader understand what you have done.
You should explicitly specify which of your charts is considered innovative, any why.
	Beeswarm + Heatmap: The beeswarm combined with a heatmap is our innovative visualization technique as it is not something that is usually used. We decided to combine these two techniques because it would still properly express our data although it is not something commonly used. 
Reflection
Describe how your project developed from an initial proposal to WIP to the final product.
The initial proposal was quite vague and just an idea, the work in progress was more detailed and had a more specific goal as we had already deviated our project to focus on a specific portion of the data set instead of the whole general set which had no proper relation. The final product is a developed page with 6 different visualization techniques, some unique, some new, and some basic charts and graphs as well.
Did the goals change?
Our goals changed after we read further about the project and what was being asked. We decided to pick a more specific data set in order to be able to develop a story surrounding it. Initially, our data was more vague and there was no real connection between it all, so we chose particular parts and a more specific idea so we were able to expand off of it. Our goal initially was also to have 6 unique techniques but we did have a hard time coming up with different visualization techniques so we did use form basic charts and graphs to show our data.
How realistic was the original proposal?
We think that the original proposal was somewhat realistic because we stuck to the same dataset and concept, but we did have to come up with different visualization techniques as the ones we initially proposed were not unique or different enough from the basic charts and graphs. 
Were there any unexpected challenges that arose? Were there features you wanted to implement that you ultimately did not? What workarounds did you do?
Some unexpected challenges arose when we started to create the visualization techniques as we realized the data set we chose did not have the certain variable we needed in order to create a chart or graph. Our options were more limited due to the type of data set we had selected to work on. There were a few features we had discussed at the time of the proposal that we would have wanted to implement but we did not have the resources and ability to do those. We had to use a few regular or basic charts to show our data as it was tougher for us to use that data to create unique visualization techniques and charts.
What would you do differently next time?
We would try to find a data set which is more interesting to us and do more research and try different ways to create visual representations of the data, we had a hard time coming up with new and unique visualization techniques. We had attempted different types of techniques, some we were able to use and others we had to replace.
Team workload
Briefly describe which team member worked on which tasks.
Harrison Boettner: Creating and designing the visualization techniques of the project, managing, data collection and cleaning
Rani Sumedha Gilla: Wireframe, manage, and designing of the project
Shiling Dai: Creating and designing the visualization techniques of the project
