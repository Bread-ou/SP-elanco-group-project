// Chat GPT setup.
const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config()

// OpenAI config 
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
const openai = new OpenAIApi(configuration)

async function getDescription(animalName){
    try {
        let prompt = `Can you give me a description of a ${animalName}?`
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            length: 200,
            n: 1,
            stop: "\n"
        })
        const description = completion.choices[0].text.trim()
        //console.log(description)
        return description
    } catch (error) {
        console.error(`OpenAI API request failed: ${error}`)
        // handle the error here (e.g. return a default value or re-throw the error)
    }
}

module.exports={
    getDescription
}