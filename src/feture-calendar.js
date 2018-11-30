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
    i18n: {
      monthes: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weeks: ['日', '一', '二', '三', '四', '五', '六']
    },
    onSelect: function (date) {
      console.log(date)
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

  function Plugin (el, options) {
    this.options = Object.assign(defaults, options)
    this.init(el)
  }

  var clickHandler = function (e) {
    var target = e.target,
        tag    = target.tagName
    if (tag != 'EM' && tag != 'B') {
      return
    }
    if (tag == 'B') {
      target = target.parentNode
    }
    if (target.classList.contains('fc-day-disabled')) {
      return
    }
    this.options.onSelect(new Date(target.date))
    this.removeActiveClass()
    target.classList.toggle('fc-day-selected')
  }

  Plugin.prototype = {

    init: function (el) {
      this.today = new Date()
      this.date = new Date()
      this.date.setDate(1)
      el.classList.add('fc')
      var weeks = this.options.i18n.weeks
      var week = createElement('div', 'fc-week')
      for (var i in weeks) {
        week.appendChild(createElement('span', null, weeks[i]))
      }
      this.body = createElement('div', 'fc-body')
      el.appendChild(week)
      el.appendChild(this.body)
      this.appendMonths(3)
      this.attachListeners()
    },

    appendMonths: function (n) {
      var date = this.date
      while (n--) {
        var current = date.getMonth()
        var month = createElement('div', 'fc-month', date.getFullYear() + '年' + (date.getMonth() + 1) + '月')
        var days = createElement('div', 'fc-days')
        this.body.appendChild(month)
        while (date.getMonth() === current) {
          this.appendDays(date.getDate(), date.getDay(), days)
          date.setDate(date.getDate() + 1)
        }
        this.body.appendChild(days)
      }
      // while loop trips over and day is at 30/31, bring it back
      date.setDate(1)
      date.setMonth(date.getMonth() - 1)
    },

    appendDays: function (day, weekday, container) {
      var disabled = this.options.disablePast && this.date.getTime() <= this.today.getTime() - 1
      var today = this.date.toDateString() === this.today.toDateString()
      var newDay = this.createDayElement(day, disabled, today)

      // if it's the first day of the month
      if (day == 1 && weekday != 0) {
        newDay.style.marginLeft = weekday * 14.2857 + '%'
        // for (var i = 0; i < weekday; i++)
        // this.month.appendChild(this.createDayElement(''))
      }
      container.appendChild(newDay)
      return container
    },

    createDayElement: function (day, disabled, today) {
      var dayEl = document.createElement('em')
      var numEl = document.createElement('b')
      numEl.innerHTML = day
      dayEl.className = 'fc-day'
      dayEl.date = this.date.getTime()

      if (disabled) {
        dayEl.classList.add('fc-day-disabled')
      }

      if (today) {
        dayEl.classList.add('fc-day-today')
        numEl.innerHTML = '今天'
      }

      dayEl.appendChild(numEl)
      return dayEl
    },

    attachListeners: function () {
      this.body.addEventListener('click', clickHandler.bind(this))
    },

    removeActiveClass: function () {
      document.querySelectorAll('.fc-day-selected').forEach(function (e) {
        e.classList.remove('fc-day-selected')
      })
    },

    destroy: function () {
      // Remove any event listeners and undo any "init" actions here...
    }
  }

  return Plugin
}))
