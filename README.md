## Why compile the Illinois Compiled Statutes if they're already compiled?

That's a good question. The primary purpose of collecting this data is to process it for use in fine-tuning a [Large Language Model (LLM)](https://en.wikipedia.org/wiki/Large_language_model) that will be specialized in performing legal tasks in the great State of Illinois. Since the statutes are only available via HTML
web pages, and the collected body of statutes is quite large, one finds it necessary to automate the task of crawling the [ILGA website](https://www.ilga.gov/legislation/ilcs/ilcs.asp), extracting only the relevant text of the statutes and saving it to a Mongo database, while retaining the ILCS numbering and naming conventions so they can be recalled and reproduced in any format.

Should be easy