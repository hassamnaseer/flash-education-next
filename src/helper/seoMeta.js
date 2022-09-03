import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = props => (
  <Helmet>
    <title>{`${props.title}`}</title>
    <meta name="title" content={`${props.title}`} data-react-helmet="true" />
    <meta property="og:title" content={`${props.title}`} data-react-helmet="true" />

    <meta property="og:locale" content="en" data-react-helmet="true" />
    <meta property="og:site_name" content="LetsFlash" data-react-helmet="true" />
    <meta
      property="og:url"
      content={props.canonical ? props.canonical : 'https://letsflash.co'}
      data-react-helmet="true"
    />
    <meta property="og:type" content="website" data-react-helmet="true" />
    <meta name="twitter:title" content={props.title} data-react-helmet="true" />
    <meta name="twitter:site" content="@letsflash" data-react-helmet="true" />
    <meta name="twitter:card" content="summary_large_image" data-react-helmet="true" />

    <meta name="theme-color" content="#04072a" data-react-helmet="true" />

    <link rel="alternate" href={props.canonical} hreflang="x-default" data-react-helmet="true" />
    <link rel="canonical" href={props.canonical} data-react-helmet="true" />

    <meta property="og:image" content="https://res.cloudinary.com/bampow/image/upload/v1631815649/Lightbulb_1.jpg" />
    <meta name="twitter:image" content="https://res.cloudinary.com/bampow/image/upload/v1631815649/Lightbulb_1.jpg" />
    <meta
      property="og:image:secure_url"
      content="https://res.cloudinary.com/bampow/image/upload/v1631815649/Lightbulb_1.jpg"
    />

    <meta name="description" content={props.desc} data-react-helmet="true" />
    <meta name="twitter:description" content={props.desc} data-react-helmet="true" />
    <meta property="og:description" content={props.desc} data-react-helmet="true"></meta>

    <meta name="robots" content="max-image-preview:large" />

    {props.css && <link rel="stylesheet" href={`${props.css}`} />}
    {props.js && <script type="text/javascript" src={`${props.js}`}></script>}

    {props.schema && <script type="application/ld+json">{JSON.stringify(props.schema)}</script>}
    {props.schema2 && <script type="application/ld+json">{JSON.stringify(props.schema2)}</script>}
    {props.schema3 && <script type="application/ld+json">{JSON.stringify(props.schema3)}</script>}
    {props.schema4 && <script type="application/ld+json">{JSON.stringify(props.schema4)}</script>}
  </Helmet>
)
export default Meta
