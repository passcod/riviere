'use strict'

const fs = require('mz/fs')
const jade = require('jade')
const koa = require('koa')
const marked = (foo) => foo
const Riviere = require('./..')

// const marked = require('marked')
// const Riviere = require('riviere')

const notFound = new Riviere()
.flow((bank, ctx) => { ctx.status = 404 })

const home = new Riviere()
.flow((bank) => { bank.startTime = new Date() })
.get('raw', () => fs.readFile('home.md'))
.get('template', () => jade.fromFile('views/home.jade'))
.get('content', ['raw'], (bank) => marked(bank.raw))
.get('word count', ['raw'], (bank) => bank.raw.split(/\s+/).length)
.get('excerpt', ['raw'], (bank) => bank.raw.slice(0, 140))
.flow(['content', 'word count', 'excerpt', 'template'], (bank, ctx) => {
  ctx.body = bank.template({
    content: bank.content,
    metadata: {
      wordCount: bank.wordCount,
      excerpt: bank.excerpt
    }
  })
})
.flow((bank, ctx) => { ctx.header('X-Render-Time', new Date() - this.startTime) })

const dispatch = new Riviere()
.split((bank, ctx) => {
  if (ctx.uri === '/') {
    return 'home'
  }

  return 'not found'
})
.into('home', home)
.into('not found', notFound)

koa().use(function *() {
  return dispatch.run(this)
}).listen(1050)
