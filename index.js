const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const inputDir = '/Users/vishalsrini/interview-prep/src'; // Change this to your input directory
const outputFilePath = './output.txt'; // Change this to your desired output file
// const outputFilePath = './output1.txt'; // Change this to your desired output file

// Function to get all files from a directory and its subdirectories
function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

// Function to concatenate contents of all files into one file
function concatenateFiles(inputDir, outputFilePath) {
    const allFiles = getAllFiles(inputDir);

    // Initialize the output file
    fs.writeFileSync(outputFilePath, '');

    allFiles.forEach(filePath => {
        const absolutePath = path.resolve(filePath);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the absolute path and file content to the output file
        fs.appendFileSync(outputFilePath, `${absolutePath}\n${fileContent}\n`);
    });

    console.log(`Contents have been concatenated into ${outputFilePath}`);
}

const openai = new OpenAI();

async function main(fileName) {
    const data = fs.readFileSync(fileName, 'utf8');
    const message = "Generate a comprehensive README file suitable for the project details added here. Include sections that cover project overview, features, installation instructions, usage examples, configuration details, testing instructions, contributions guidelines, and contact information for the developer or team. Ensure the README provides clear and concise instructions for setting up the project locally, running tests, and any prerequisites or dependencies. Additionally, consider including a section for potential future enhancements or considerations. Project Details below - \n" + data
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: message }],
        model: "gpt-3.5-turbo-16k",
    });

    console.log(completion.choices[0]);

    if(completion.choices[0]?.message?.content)
    fs.writeFileSync('./README.md', completion.choices[0]?.message?.content);
}

// Run the function
concatenateFiles(inputDir, outputFilePath);
main(outputFilePath);
