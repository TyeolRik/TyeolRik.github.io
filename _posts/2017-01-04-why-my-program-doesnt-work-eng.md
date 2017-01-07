---
layout: post
title: "Why my source code doesn't work properly? [ENG]"
section-type: post
category: theory
tags: [ 'theory', 'overflow' ]
---
### 본 문서를 한국어로 읽고 싶으신가요?
**[여기]({{ site.baseurl }}{% link _posts/2017-01-04-why-my-program-doesnt-work-kor.md %})**를 클릭하세요. 영어를 잘 못하므로 한국어로 읽는 것을 추천드립니다! **LUL**

## About Overflow

### How I started studying Overflow

I was studying GridView of Android. ~~Actually close to pratical exercise rather than studying.~~ The exercise was making calendar by using GridView which is one of the selection widget. But, the matter was that I don't have any idea about the way how I set back the calendar one day. ~~In fact, I had an error in using the method, Calendar.add(), at the gridview.~~
So, I made a decision that I have to use abnormal way. it was using the methods, Calendar.getTimeinMillis() and setTimeinMillis(long millis)

{% highlight java %}
// Get the 1st date of Grid.
Calendar calendar = new GregorianCalendar(); // Set calendar to today.
calendar.set(Calendar.DATE, 1) // Set calendar to 1st of this month
// Set the number of days that difference between month 1st and grid 1st.
int wantDateToReduce = calendar.get(Calendar.DAY_OF_WEEK) - 1 // Sunday is 1 in Calendar constant. So, we are able to know the 1st day of grid by subtracting 1 from day of week.
long millisCalc = getTimeinMillis() - (wantDateToReduce * 24 * 60 * 60 * 1000) // 1day = 24hours * 60mins * 60secs * 1000 millisecs
calendar.setTimeinMillis(millisCalc);

// The method that returns the date which corresponds position in grid to Calendar.
public Calendar getCalendarOnPosition(int position) {
    Calendar resultCalendar;
    resultCalendar = calendar; // Set the calendar to position 0 of grid.
    
    long resultMillis = position * (24 * 60 * 60 * 1000); // 24 * 60 * 60 * 1000 == 1day in millisecs
    resultCalendar.setTimeinMillis(resultMillis);
}
Calendar[] calendarArray; // I want to save this in array.
calendarArray = new Calendar[42];
for(int i = 0; i < 42; i++) { // The reason why i = 42 is that calendar goes up to 42 cells.
    calendar[i] = getCalendarOnPosition(i); // Abnormal result are saved from i=25
}
{% endhighlight java %}
