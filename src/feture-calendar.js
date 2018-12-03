/*
 * feture-calendar
 * author: backflow
 * email: hunan_me@163.com
 */
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
    max: 12,
    format: 'mm月dd日',
    range: ['入住', '离店'],
    i18n: {
      unit: '晚',
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      today: '今天',
      y: '年',
      m: '月',
      d: '日'
    },
    disablePast: true,
    onSelect: console.log
  }

  //
  //  private helper functions
  //
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
    var disabled = options.disablePast && when.getTime() - now.getTime() < 0,
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

  function removeActiveClass () {
    document.querySelectorAll('.fc-day-selected').forEach(function (e) {
      e.classList.remove('fc-day-selected')
      e.classList.remove('fc-range-from')
      e.classList.remove('fc-range-to')
    })
  }

  function setRangeText (el, html, from) {
    var textEl = el.querySelector('i')
    if (textEl == null) {
      textEl = createElement('i', from ? 'fc-day-from' : 'fc-day-to', html)
      el.appendChild(textEl)
    } else {
      textEl.innerHTML = html
    }
  }

  function toggleRangeClass (elems, clazz) {
    var next = elems[0].nextElementSibling
    while (next != null && next != elems[1]) {
      if (!next.classList.contains('fc-month')) {
        next.classList.toggle(clazz)
      }
      next = next.nextElementSibling
    }
  }

  function rangeSelect (el, selected, range, ctx) {
    if (selected.length >= 2) {
      toggleRangeClass(selected, 'fc-range')
      selected.forEach(function (e) {
        e.removeChild(e.querySelector('i'))
        e.classList.remove('fc-tip')
        e.classList.remove('fc-day-selected')
        e.classList.remove('fc-range-from')
        e.classList.remove('fc-range-to')
        e.title = ''
      })
      selected.length = 0
    }
    if (selected.includes(el)) {
      return
    }
    selected.push(el)
    el.classList.add('fc-day-selected')
    if (selected.length == 1) {
      setRangeText(el, range[0], true)
    } else {
      selected.sort(function (a, b) { return a.time - b.time })
      setRangeText(selected[0], range[0], true)
      setRangeText(selected[1], range[1])
      toggleRangeClass(selected, 'fc-range')
      var days = (selected[1].time - selected[0].time) / 1000 / 60 / 60 / 24
      el.title = days + ctx.options.i18n.unit
      el.classList.add('fc-tip')
      selected[0].classList.add('fc-range-from')
      selected[1].classList.add('fc-range-to')
      return true
    }
  }

  function singleSelect (el, selected, ctx) {
    removeActiveClass(ctx.el)
    el.classList.add('fc-day-selected')
    selected.length = 0
    selected.push(el)
  }

  function pad (s, n, c) {
    return Array((n || 2) - String(s).length + 1).join(c || '0') + s
  }

  function format (time, options) {
    var date = new Date(time)
    return options.format.replace(/yyyy/ig, date.getFullYear())
      .replace(/yy/ig, String(date.getFullYear()).substring(2, 4))
      .replace(/mm/ig, pad(date.getMonth() + 1))
      .replace(/m/ig, date.getMonth() + 1)
      .replace(/dd/ig, pad(date.getDate()))
      .replace(/d/ig, date.getDate())
  }

  function days_between (from, to) {
    // The number of milliseconds in one day
    var unit_day = 1000 * 60 * 60 * 24

    // Calculate the difference in milliseconds
    var distance = Math.abs(from - to)

    // Convert back to days and return
    return Math.round(distance / unit_day)
  }

  var clickHandler = function (evt) {
    var el = evt.target, tag = el.tagName
    if (tag != 'EM' && tag != 'B') return
    if (tag == 'B') el = el.parentNode
    if (el.classList.contains('fc-day-disabled')) return
    var selected = this.selected,
        options  = this.options,
        range    = options.range

    var rs = range && range.length == 2
    rs ?
      rangeSelect(el, selected, range, this) :
      singleSelect(el, selected, this)
    var dates = selected.map(function (el) {
      return format(el.time, options)
    })
    if (dates.length == 2) {
      dates.push(days_between(selected[0].time, selected[1].time))
    }
    this.options.onSelect(dates)
    this.dates = dates
  }

  var scrollHandler = function (e) {
    var el = e.target
    // element is at the end of its scroll, load more content
    if (el.scrollHeight - el.scrollTop === el.clientHeight) {
      this.append(1)
    }
  }

  //
  //  Plugin definition
  //
  function Plugin (el, options) {
    if (el.fc) {
      return
    }
    this.options = Object.assign(defaults, options)
    this.selected = []      // selected dates
    this.months = 0         // total months
    this.date = new Date()  // current date
    this.el = el
    el.classList.add('fc')

    // week header
    var week = createElement('div', 'fc-week')
    this.options.i18n.weeks.forEach(function (e) {
      week.appendChild(createElement('b', null, e))
    })
    el.appendChild(week)

    // main body
    this.body = createElement('div', 'fc-body')
    this.append(this.options.months)
    this.body.addEventListener('click', clickHandler.bind(this))
    this.body.addEventListener('scroll', scrollHandler.bind(this))
    el.appendChild(this.body)
    el.fc = this
  }

  Plugin.prototype = {
    append: function (n) {
      var i18n = this.options.i18n,
          date = this.date,
          now  = new Date()

      date.setDate(1)
      while (n--) {
        if (this.months + 1 > this.options.max) {
          return
        }
        var current = date.getMonth()
        var monthEl = createElement('div', 'fc-month', date.getFullYear() + i18n.y + (date.getMonth() + 1) + i18n.m)
        this.body.appendChild(monthEl)
        while (date.getMonth() === current) {
          appendDays(date, now, this.options, this.body)
          date.setDate(date.getDate() + 1)
        }
        this.months++
      }
    },

    select: function (dates) {

      // getter
      if (!dates) {
        return this.dates
      }

      // range of dates
      if (Array.isArray(dates)) {

      }
      // single date
      else {

      }
    }
  }

  return Plugin
}))
