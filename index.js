'use strict'

// const co = require('co')
const inflect = require('inflection')

class Riviere {
  constructor () {
    this.flows = []
    this.gets = {}
    this.ports = {}
  }

  flow (deps, fn) {
    if (typeof fn === 'undefined') {
      fn = deps
      deps = []
    }

    this.flows.push({deps: deps, fn: fn})
    return this
  }

  get (name, deps, fn) {
    if (typeof fn === 'undefined') {
      fn = deps
      deps = []
    }

    this.gets[inflect.camelize(name)] = {deps: deps, fn: fn}
    return this
  }

  split (deps, fn) {
    if (typeof fn === 'undefined') {
      fn = deps
      deps = []
    }

    const splitter = fn

    this.flows.push({deps: deps, fn: splitter})
    return this
  }

  into (name, port) {
    this.ports[inflect.camelize(name)] = port
    return this
  }

  run () {
    const params = []
    for (let arg of arguments) {
      params.push(arg)
    }

    console.log('Hello')
    console.log(params)
  }
}

module.exports = Riviere
