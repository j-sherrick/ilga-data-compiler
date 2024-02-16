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
- [ChromaDB](https://www.trychroma.com/)

The Illini Compiler project embarks on the challenge of making legal information more accessible, starting with the ethical extraction of legal documents from the web. Utilizing Puppeteer, this initiative adopts a browser-like approach for data scraping, aligning with the intended use of websites and ensuring a respectful interaction with online resources. This step sets the foundation for data collection, emphasizing both efficiency and ethical considerations.

Following data extraction, the project transitions to organizing and structuring the collected information. Mongoose plays a pivotal role at this stage, processing the data into structured document models for storage in MongoDB. This organized approach prepares the groundwork for advanced analysis, facilitating the transformation of complex legal texts into a format ready for deeper exploration.

The culmination of this effort is the conversion of structured data into vector embeddings within ChromaDB, paving the way for innovative legal analysis through Retrieval Augmented Generation technologies. This strategy enables the detailed examination and summarization of vast collections legal documents. The Illini Compiler project stands as a testament to the power of modern technology in enhancing the accessibility and comprehension of legal information, demonstrating a commitment to democratizing legal knowledge.