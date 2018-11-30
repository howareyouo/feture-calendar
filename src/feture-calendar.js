(function (root, factory) {
  var pluginName = 'FetureCalendar'
  if (typeof define === 'function' && define.amd) {
    define([], factory(pluginName))
  } else if (typeof exports === 'object') {
    module.exports = factory(pluginName)
  } else {
    root[pluginName] = factory()
  }
}(this, function () {
  'use strict'

  var defaults = {
    months: 3,
    range: ['入住', '离店'],
    i18n: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      today: '今天'
    },
    onSelect: function (date) {
    }
  }

  /**
   * Private Helper Functions
   */
  function createElement (tag, clazz, html) {
    var el = document.createElement(tag)
    if (clazz) {
      el.className = clazz
    }
    if (html) {
      el.innerHTML = html
    }
    return el
  }

  function createDayElement (date, disabled, today, todayText) {
    var dayEl = document.createElement('em')
    var numEl = document.createElement('b')
    numEl.innerHTML = date.getDate()
    dayEl.className = 'fc-day'
    dayEl.time = date.getTime()

    if (disabled) {
      dayEl.classList.add('fc-day-disabled')
    }

    if (today) {
      dayEl.classList.add('fc-day-today')
      numEl.innerHTML = todayText
    }

    dayEl.appendChild(numEl)
    return dayEl
  }

  function appendDays (when, now, options, container) {
    var disabled = options.disablePast && when.getTime() <= now.getTime() - 1,
        today    = when.toDateString() === now.toDateString(),
        weekday  = when.getDay(),
        day      = when.getDate()

    var dayEl = createDayElement(when, disabled, today, options.i18n.today)

    // if it's the first day of the month
    if (day == 1 && weekday != 0) {
      dayEl.style.marginLeft = weekday * 14.2857 + '%'
      // for (var i = 0; i < weekday; i++)
      // this.month.appendChild(this.createDayElement(''))
    }
    container.appendChild(dayEl)
    return container
  }

  function removeActiveClass (el) {
    el.querySelectorAll('.fc-day-selected').forEach(function (e) {
      e.classList.remove('fc-day-selected')
      e.classList.remove('fc-range-from')
      e.classList.remove('fc-range-to')
    })
  }

  function rangeSelect (tar, range, elems, ctx) {
    if (elems.length < 2) {
      tar.classList.add('fc-day-selected')
      elems.push(tar)
      if (elems.length == 2) {
        elems.sort(function (a, b) {
          return a.time - b.time
        })
        elems[0].classList.add('fc-range-from')
        elems[1].classList.add('fc-range-to')
      }
    } else {
      singleSelect(tar, elems, ctx)
    }
    console.log(elems)
  }

  function singleSelect (tar, elems, ctx) {
    removeActiveClass(ctx)
    tar.classList.add('fc-day-selected')
    elems.length = 0
    elems.push(tar)
  }

  function Plugin (el, options) {
    this.options = Object.assign(defaults, options)
    this.elems = []
    this.date = new Date()
    this.date.setDate(1)
    this.el = el
    this.init()
  }

  var clickHandler = function (e) {
    var tar = e.target,
        tag = tar.tagName
    if (tag != 'EM' && tag != 'B') {
      return
    }
    if (tag == 'B') {
      tar = tar.parentNode
    }
    if (tar.classList.contains('fc-day-disabled')) {
      return
    }

    var date = new Date(tar.time)
    this.options.onSelect(date)

    var range = this.options.range,
        elems = this.elems

    if (range && range.length == 2) {
      rangeSelect(tar, range, elems, this.el)
    } else {
      singleSelect(tar, elems, this.el)
    }
  }

  Plugin.prototype = {

    init: function () {
      this.el.classList.add('fc')
      var weeks = this.options.i18n.weeks
      var week = createElement('div', 'fc-week')
      for (var i in weeks) {
        week.appendChild(createElement('span', null, weeks[i]))
      }
      this.body = createElement('div', 'fc-body')
      this.el.appendChild(week)
      this.el.appendChild(this.body)
      this.appendMonths(this.options.months)
      this.attachListeners()
    },

    appendMonths: function (n) {
      var date = this.date,
          now  = new Date()
      while (n--) {
        var current = date.getMonth()
        var monthEl = createElement('div', 'fc-month', date.getFullYear() + '年' + (date.getMonth() + 1) + '月')
        var daysEl = createElement('div', 'fc-days')
        this.body.appendChild(monthEl)
        while (date.getMonth() === current) {
          appendDays(date, now, this.options, daysEl)
          date.setDate(date.getDate() + 1)
        }
        this.body.appendChild(daysEl)
      }
      // while loop trips over and day is at 30/31, bring it back
      date.setDate(1)
      date.setMonth(date.getMonth() - 1)
    },

    attachListeners: function () {
      this.body.addEventListener('click', clickHandler.bind(this))
    },

    destroy: function () {
      // Remove any event listeners and undo any "init" actions here...
    }
  }

  return Plugin
}))
