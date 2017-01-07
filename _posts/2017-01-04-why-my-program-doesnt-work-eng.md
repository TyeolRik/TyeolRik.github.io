---
layout: post
title: Overflow - "Why my code doesn't work properly?" [ENG]
section-type: post
category: theory
tags: [ 'english', 'theory' , 'overflow']
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

I agonize the reason why it doesn't work at position=25. ~~I was lost in thought long time~~ The problem was the part, calculating (long) resultMillis.

``` {.java}
long resultMillis = position * (24 * 60 * 60 * 1000); // 24 * 60 * 60 * 1000 == 1day
```

I thought that resultMillis value was calculated in long data format because resultMillis was long format. But, in fact, the left side was all calculated in int format and saved in long format because variable named position was int. Damn...

> Yes. Overflow occurs.

### The meaning of Overflow

> Definition: The generation of a number or other data item which is too large for the assigned location or memory space.

All variable are assigned to some parts of memory. For example, there is a 8 bits variable named A. Then, A has a minimum value of -128 and a maximum value of 127 (inclusive)

``` {.java}
byte A = 127;
A = A+1;
System.out.println(String.valueOf(A)); // -128 is shown.
```

If you write above codes, A becomes -128. The byte type has maximum value of +127. So, next number becomes -128. ~~It would be easier that number type is Circular Queue with 256 buffer(space).~~

 ### Examples of Overflow
 
 > Stack Overflow

Stack Overflow is the error when there is lack of memory. Fuctions makes stacks for saving variable or something else. However, if fuctions are executed recursively, stacks are mounting up. And, when the system reaches the limit, Stack overflow is occured. ~~I think that probably developer's forum, <a href="http://stackoverflow.com/"><font color="#2d2d2d">StackOverflow</font></a> might be named on the meaning of searching here because there would be tons of errors if you write code recursively. LUL~~

> Heartbleed (Buffer Overflow)

It was a real shock that heartbleed bug, which I learned when I was studying about overflow, existed. In 2014, Finnish security company announced fatal flaws of OpenSSL. OpenSSL is software which is used for exchanging their information between computer and server. And a lot of IT service, cards or financial crypto system depends on OpenSSL. OpenSSL needs to keep connection even though no need to exchange information. So, OpenSSL uses the signal which is named HeartBeat.

>> User: "Apple", 5 Letters.  
>> Server: 5 Letters, OK, "Apple"  
>> User: "Banana". 6 Letters.  
>> Server: 6 Letters, OK, "Banana"  
>> User: "Computer", 5000 Letters.  
>> Server: 5000 Letters, OK, "Computer Banana Apple Pizza Hambuger McDonald John Mike Bla Bla Bla"

User sends random data packets periodically so as to notice server's existence and, server returns exactly some amount of data to report its existence. However, user states amount of data falsely, server draw another information which was in its memory because server has responsibility of sending exactly same data. This is sort of buffer overflow. If user do this process repeatedly, user can build up server's data. In other words, server data is leaked.

> The explosion of Ariane 5

When my professor introduce overflow in college, she said that spaceship exploded because of overflow error. That spaceship is named Ariane 5. On June 4th, 1996, Ariane 5 was exploded in 37 seconds after blasting off. The reason was overflow that is occured in the process which is converting 64 bits data to 16 bits data. Scientists at that time predict that Ariane 4's speed can't over the maximum of 16 bits integer data type(32,767) and, they wrote the codes. But, they copied and pasted same codes to Ariane 5. ~~They announced that the reason why they use same codes is optimization problem. But, I don't think so LUL~~ ~~Ariane 5 is much faster than 4~~
