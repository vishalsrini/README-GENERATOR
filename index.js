const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI();

const inputDir = '/Users/vishalsrini/interview-prep/src'; // Change this to your input directory
const outputFilePath = './output.txt'; // Change this to your desired output file

// Function to get all files from a directory and its subdirectories
function getAllFiles(dirPath) {
    let arrayOfFiles = [];
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            arrayOfFiles = arrayOfFiles.concat(getAllFiles(filePath));
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

// Function to concatenate contents of all files into one file
function concatenateFiles(inputDir, outputFilePath) {
    const allFiles = getAllFiles(inputDir);
    const excludedPatterns = ['node_modules', 'model', 'ttf', 'jar', 'img', 'resources', 'iml', 'target', 'WebContent', 'assets', 'www', 'package-lock.json'];

    // Initialize the output file
    fs.writeFileSync(outputFilePath, '');

    allFiles.forEach(filePath => {
        if (!excludedPatterns.some(pattern => filePath.includes(pattern)) && (filePath.indexOf('.') > (filePath.length - 7))) {
            const absolutePath = path.resolve(filePath);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            fs.appendFileSync(outputFilePath, `${absolutePath}\n${fileContent}\n`);
        }
    });

    console.log(`Contents have been concatenated into ${outputFilePath}`);
}

async function main(fileName) {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        const message = "You are a README file generator. Generate a comprehensive README file suitable for the project. Include sections that cover project overview, features, installation instructions, usage examples, configuration details, testing instructions, contributions guidelines, and contact information for the developer or team. Ensure the README provides clear and concise instructions for setting up the project locally, running tests, and any prerequisites or dependencies. Additionally, consider including a section for potential future enhancements or considerations.";
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: [
                { role: "system", content: message },
                { role: "user", content: data }
            ],
        });

        if (completion.choices[0]?.message?.content) {
            fs.writeFileSync('./README.md', completion.choices[0].message.content);
            console.log('README.md has been generated.');
        }
    } catch (error) {
        console.error('Error generating README:', error);
    }
}

// Run the function
concatenateFiles(inputDir, outputFilePath);
main(outputFilePath);
