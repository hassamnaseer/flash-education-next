import React from 'react'

import Meta from '../../helper/seoMeta'
import OrganizationSchema from '../../schemas/Organization.json'
import WebpageSchema from '../../schemas/WebPage.json'
import BreadcrumbSchema from '../../schemas/BreadcrumbList.json'
import WebsiteSchema from '../../schemas/Website.json'

import { useRouter } from 'next/router'

const Blogs = () => {
  const router = useRouter();

  const blogs = [
    {
      name: "How Do Flash Cards Help With Studying",
      route: "/blogs/how-do-flash-cards-help-with-studying"
    },
    {
      name: "AI And Education",
      route: "/blogs/AI-and-education"
    },
    {
      name: "Study Tips",
      route: "/blogs/study-tips"
    },
    {
      name: "How To Get Perfect Grade Point Average",
      route: "/blogs/how-to-get-perfect-grade-point-average"
    },
    {
      name: "Tips for applying for scholarships",
      route: "/blogs/tips-for-applying-for-scholarships"
    },
    {
      name: "Semantic memory and auditory component",
      route: "/blogs/semantic-memory-and-auditory-component"
    },
    {
      name: "Exceptional study tips to boost productivity among students",
      route: "/blogs/exceptional-study-tips-to-boost-productivity-among-students"
    },
    {
      name: "Multitasking Studying",
      route: "/blogs/multitasking-studying"
    }
  ]

  const goToBlog = (blog) => {
    router.push(blog.route)
  }

  return (
    <>
      <div className="step12">
        <Meta
          title="Blog - LetsFlash - Virtual Study Assistant"
          desc="Virtual Study Assistant for any Occasion."
          canonical="https://letsflash.co/blog"
          schema={OrganizationSchema}
          schema2={WebpageSchema.blog}
          schema3={BreadcrumbSchema.blog}
          schema4={WebsiteSchema}
        />
        <div>
          <section className="cate-hdng">
            <div className="container">
              <div className="cate_hdng">
                <div className="category_heading">
                  <h2>Blog</h2>
                </div>
                <div className="row blog-row">
                  {blogs && blogs.length > 0 && blogs.map((blog, index) => {
                    return (
                      <div key={index} className="col-sm-2 blog-col" onClick={() => goToBlog(blog)}>
                        <img className="img-fluid" src="/images/logo.png" alt="logo" /> 
                        <div className="blog-name">{blog.name}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Blogs