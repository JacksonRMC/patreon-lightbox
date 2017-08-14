A basic Lightbox gallery app that displays trending .gifs from GIPHY

I am using browser-sync as a dev server for this project. Something like
webpack-dev-server seemed like overkill for vanilla js.

I made the decision to define all the functions outside of main(). I wrestled a
bit with this decision. The downside to my choice was that I need to pass the
`allData` object to a bunch of other functions that need access to this data.
I could have defined these functions in the main() function and had access to
this array as a global variable, but I felt the code was cleaner the way I have it.

Arrows will click through open lightbox.
