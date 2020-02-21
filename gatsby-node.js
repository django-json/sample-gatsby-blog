/*
	Pulling createFilePath function to create the file path for the slug.
*/
const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require(`path`);
/*
	node property
		- is the representation of file(s).

		Properties:
			1. internal property
				- represents data about the actual node itself.

				Properties:
					1.1. type property
						- the type of node.

	actions property
		- another property that we get from gatsby.
		- this object holds the functions that enables us to create a node field.
*/
exports.onCreateNode = ({ node, actions, getNode }) => {
	/*
		Pulling the createNodeField function to create a node field.
	*/
	const { createNodeField } = actions
	if (node.internal.type === `MarkdownRemark`) {
		/*
			slug
				- is the url or the link that the browser is able to access from our application in order to the page required.

		*/
		const slug = createFilePath({ node, getNode })

		/*	
			Create a new node field with a field name `slug` and a value of slug variable.
		*/
		createNodeField({
			node,
			name: `slug`,
			value: slug
		})
	}
}

exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions

	return graphql(`
		{
		  allMarkdownRemark {
		    edges {
		      node {
		        fields {
		          slug
		        }
		      }
		    }
		  }
		}
	`).then(result => {
		result.data.allMarkdownRemark.edges.forEach(({node}) => {
			createPage({
				path: node.fields.slug,
				component: path.resolve(`./src/templates/blog-post.js`),
				context: {
					/*
						Data passed to context is availabe in page queries as GraphQL variables
					*/
					slug: node.fields.slug
				}
			})
		})
	})
}