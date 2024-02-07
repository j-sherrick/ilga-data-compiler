# Illini Compiler

Illini Compiler is a web scraping and data transformation project aimed at compiling government and legal data from publicly available sources in Illinois. The project focuses on gathering text from various sources, including:

- The text of the [Illinois Compiled Statutes](https://www.ilga.gov/legislation/ilcs/ilcs.asp)
- [Illinois Court Opinions](https://www.illinoiscourts.gov/top-level-opinions/)
- [Illinois Administrative Code](https://www.ilga.gov/commission/jcar/admincode/titles.html)
- And much more!

## Overview

The Illini Compiler project is an endeavor leveraging modern JavaScript and Node.js to extract data from official sources in Illinois. Powered by the following technologies:

- [NodeJS](https://github.com/nodejs/node?tab=readme-ov-file#table-of-contents)
- [ECMAScript 6](https://262.ecma-international.org/6.0/)
- [Puppeteer](https://pptr.dev/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

The critical first stage in this process is facilitated by Mongoose, used to preprocess the scraped data into structured document Models and save to MongoDB. This step ensures that our data is optimized, organized, and ready for further analysis and processing.

As our project progresses, we will begin transforming the structured data into a vector database using ChromaDB. This transition will open up new avenues for legal insights and analysis using Retrieval Augemented Generation, and LLMs fine-tuned only on specific portions of enormous collections of documents, such as the Administrative Code.

The Illini Compiler project is not just about data extraction and preprocessing—it's a personal journey of making legal information more accessible and comprehensible for all, and to demonstrate the power of modern LLMs in augmenting the legal research process.

## Built With

- [NodeJS](https://github.com/nodejs/node?tab=readme-ov-file#table-of-contents)
- [Puppeteer](https://pptr.dev/)
- [ECMAScript 6](https://262.ecma-international.org/6.0/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)