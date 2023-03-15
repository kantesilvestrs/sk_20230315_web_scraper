#! /usr/bin/env node

import PACKAGE from './package.json';
import { Command } from "commander";
import fs from 'fs'
import path from 'path'
import fetch from "node-fetch";
import { parse } from 'node-html-parser';
import { findPrice, findFrequency, getTargetFrequencyPrice } from "./utils";

const program = new Command();

type ProgramOptions = {
  /**
   * Target URL for scrapping
   */
  url: string;
  /**
   * Output directory for the JSON file
   */
  outDir?: string;
  /**
   * Product query CSS selector
   */
  productSelector: string;
  /**
   * Title query CSS selector
   */
  titleSelector: string;
  /**
   * Description query CSS selector
   */
  descriptionSelector: string;
  /**
   * Price query CSS selector
   */
  priceSelector: string;
  /**
   * Frequency query CSS selector
   */
  frequencySelector: string;
  /**
   * Discount query CSS selector
   */
  discountSelector: string;
  /**
   * Discount frequency CSS selector
   */
  discountFrequencySelector: string;
}

// Using commander to establish a new CLI program and adding some default values that can be overriden for custom webscraping
program
  .version(PACKAGE.version)
  .description("CLI for scraping product options of a webpage")
  .option("-u, --url  [value]", "Webpage URL", "https://wltest.dns-systems.net/")
  .option("-ps, --productSelector [value]", "Product query CSS selector", ".widget .pricing-table .package")
  .option("-ts, --titleSelector [value]", "Title query CSS selector, relative to productSelector", ".header h3")
  .option("-descs, --descriptionSelector [value]", "Description query CSS selector, relative to productSelector", ".package-features .package-name")
  .option("-ps, --priceSelector [value]", "Price query CSS selector, relative to productSelector", ".package-price .price-big")
  .option("-fs, --frequencySelector [value]", "Frequency query CSS selector, relative to productSelector", ".package-price")
  .option("-discs, --discountSelector [value]", "Discount query CSS selector, relative to productSelector", ".package-price p")
  .option("-discfs, --discountFrequencySelector [value]", "Discount frequency query CSS selector, relative to productSelector", ".package-price p")
  .parse(process.argv);

/**
 * Output product shape
 */
type ProductOption = {
  title: string;
  description: string;
  price: number;
  annualPrice: number;
  discount?: number;
  discountFrequency?: string;
  frequency?: string;
}

async function run(options: ProgramOptions) {
  try {
    console.log('Fetching webpage...');

    // We fetch the website
    const result = await fetch(options.url);

    // Convert incoming data to text
    const rawHTML = await result.text();

    // Parse HTML text into actual HTML nodes tht we can query using CSS selectors
    const parsedHTML = parse(rawHTML);

    // Locate all product nodes that we are going scrape
    const productNodes = parsedHTML.querySelectorAll(options.productSelector);

    console.log("Scraping data...")
    const scrapedProductOptions: ProductOption[] = [];
    for (const productNode of productNodes) {

      // Scrape all data points dictated by the output shape
      const title = productNode.querySelector(options.titleSelector)?.text || "";
      const description = productNode.querySelector(options.descriptionSelector)?.text || "";
      const price = findPrice(productNode.querySelector(options.priceSelector)?.text || "") || 0;

      // We need to scrape price frequency to understand what is the annual price
      const frequency = findFrequency(productNode.querySelector(options.frequencySelector)?.text || "");

      const discount = findPrice(productNode.querySelector(options.discountSelector)?.text || "") || 0;
      const discountFrequency = discount > 0 ? findFrequency(productNode.querySelector(options.discountFrequencySelector)?.text || "") : undefined;

      scrapedProductOptions.push({
        title,
        description,
        price,
        // Use a utility to pre-calculate the annual price for later sorting
        annualPrice: getTargetFrequencyPrice(price, frequency, "Y"),
        frequency,
        discount,
        discountFrequency
      })
    }

    console.log("Re-ordering product options by annual price with most expensive options first...");

    // Based on the previously calculated annual price we sort the product options
    scrapedProductOptions.sort(({ annualPrice: a }, { annualPrice: b }) => b - a);

    const newFileName = `products-${Date.now()}.json`;

    fs.writeFileSync(path.resolve(__dirname, newFileName), JSON.stringify(scrapedProductOptions));

    console.log(`Saved products in ${newFileName}`);
  } catch (ex) {
    console.log("There was an unexpected issue", ex)
  }
}

const options = program.opts<ProgramOptions>();
run(options);