const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const remark = require('remark');
const html = require('remark-html');

const postsDirectory = path.join(process.cwd(), 'posts')

export const getSortedPostsData = () => {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((filename) => {
        const id = filename.replace(/\.md$/, '')
        
        //Read markdown as string
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        //Use gray-matter to parst the post meta-data section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            ...matterResult.data
        }
    })

    //Sort the results by date
    return allPostsData.sort((a,b) => {
        if(a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })

}

export const getAllPostIds = () => {
    const filenames = fs.readdirSync(postsDirectory)

    return filenames.map((filename) => {
        return {
            params: {
                id: filename.replace(/\.md$/, '')
            }
        }
    })
}

export const getPostData = async (id:string) => {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML COOOL
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    
    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml,
        ...matterResult.data as {date: string, title: string}
    }
}
