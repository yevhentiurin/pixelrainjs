(function()
{
  // const ;

  var cvs, ctx,
    drops, bgImg, dstRect;

  dstRect = 
  {
    x1: 60,
    y1: 320,
    x2: 180,
    y2: 330
  }

  function Drop(x0, y0, k)
  {
    var x = x0, 
      y = y0, 
      speed = Math.max(Math.round(k * 10), 3),
      length = Math.max(Math.round(k * 80), 10),
      opacity = Math.max(k, 0.5),
      width = Math.max((1-k)*3, 1);

    function animate()
    {
      y += speed;
    };

    function getPoints()
    {
      return { 
        x1: x, 
        y1: y, 
        x2: x, 
        y2: y - length, 
        o: opacity,
        w: width
      };
    };

    return {
      // public methods
      getPoints: getPoints,
      animate: animate
    };
  };

  function animateDrops()
  {
    for (var i in drops)
    {
      if (drops[i] !== undefined)
      {
        drops[i].animate();

        var points = drops[i].getPoints();
        
        if (points.x1 > dstRect.x1 && points.x1 < dstRect.x2 && points.y1 > dstRect.y1 && points.y1 < dstRect.y2)
        {
          drops[i] = undefined; 
        };
      };
    };
  };

  function clearDrops()
  {
    for (var i in drops)
    {
      if (drops[i] !== undefined)
      {
        if (drops[i].getPoints().y1 > cvs.height)
        {
          drops[i] = undefined; 
        };
      };
    };

    var i = -1;

    while (drops[i] == undefined && i < drops.length)
      i++;

    drops = drops.slice(i);
  };

  function produceDrops()
  {
    for (var i = 0; i < 20; i++)
    {
      var dropX;

      do
        dropX = Math.round(Math.random() * cvs.width);
      while (dropX % 10 > 0);

      drops.push(Drop(dropX, 0, Math.random()));
    };

    setTimeout(produceDrops, 100 * Math.random());
  };

  function clear()
  {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "#EFEFEF";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
  };

  function draw()
  {
    clear();

    // draw bg image
    try
    {
      ctx.drawImage(bgImg, 0, 0);
    } 
    catch (e) 
    {};

    ctx.strokeStyle = "#191718";
    
    for (var i in drops)
    {
      if (drops[i] !== undefined)
      {
        var points = drops[i].getPoints();
        
        ctx.beginPath();
        ctx.lineWidth = points.w;
        ctx.moveTo(points.x1, points.y1);
        ctx.lineTo(points.x2, points.y2);
        ctx.stroke();
      };
    };
    
  };

  function init()
  {
    cvs = document.getElementById('main');

    if (cvs.getContext)
    {
      ctx = cvs.getContext('2d');
    };

    drops = [];

    bgImg = new Image();
    bgImg.src = 'bg.jpg';
  };

  function main()
  {
    init();

    if (ctx)
    {
      setInterval(draw, 17);
    };

    produceDrops();                  
    setInterval(clearDrops, 1000);
    setInterval(animateDrops, 10);
    setInterval(function() {console.log(drops.length);}, 5000);
  };

  function windowLoaded(event)
  {
    window.removeEventListener("load", windowLoaded, false); //remove listener, no longer needed
    
    main();
  };

  window.addEventListener("load", windowLoaded, false);

}(window));