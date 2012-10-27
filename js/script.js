var inputData = {data:{'girls':186, 'beer':237, 'milk':95, 'food':140, 'rent':223}, labels:{x:'Things', y:'Money', header:'My finances'} }

				function koChart(){}

				koChart.prototype = 
				{
					init:function(inputData, options) 
					{
						this.max = 0;
						this.min = 0;
						this.summ = 0;
						this.thingsCount = 0;
						for (var item in  inputData.data)
						{
							if (inputData.data[item] > this.max)
								this.max = inputData.data[item];
							if (inputData.data[item] < this.min)
								this.min = inputData.data[item];
							this.summ += (inputData.data[item]);
							this.thingsCount ++;
						}

						this.inputData = inputData;

						var cnvs = document.getElementById('pieChart');	
						this.ok = false;
						this.options = options;

						console.log(this.options)

						if (cnvs.getContext)
						{
							ctx = cnvs.getContext('2d');
							this.ok = true;

							this.cX = ctx.canvas.width/2;
							this.cY = ctx.canvas.height/2;

							this.createChart();
						}
					},
					
					createChart:function()
					{
						console.log(this.options)
						switch (this.options.chartType)
						{
							case 'pie':
								this.drawPieChart();
							break;

							case 'bar':
								this.drawBarChart();
							break;

							default:
								this.drawPieChart();
							break;
						}
					},

					drawBarChart:function()
					{
						//drawing coord.lines
						this.drawLines();

						// drawing labels
						this.drawChartLabels();

						this.barWidth = Math.floor( this.diagramm.width/ (this.thingsCount*(1.28) + 0.28) );
						this.barMargin = Math.floor(this.barWidth*0.28);


						//drawing bars
						var n=0;
						for (var item in inputData.data)
						{
							this.drawBar({label:item, value:inputData.data[item], n:n});
							n++;
						}
					},

					//todo: rename this f-n
					drawLines:function()
					{

						//vertical line
						var v = new Object();
						v.ty  = Math.floor(this.cY*0.4);
						v.tx  = Math.floor(this.cX*0.3);
						v.by  = Math.floor(2*this.cY*0.9);
						v.bx  = v.tx;

						var h = new Object();
						h.lx = v.bx;
						h.ly = v.by;
						h.rx = Math.floor(2*this.cX*0.95);
						h.ry = h.ly;

						ctx.strokeStyle = '#666';
						ctx.lineWidth = 2;

						ctx.moveTo(v.tx, v.ty);
						ctx.lineTo(v.bx, v.by);

						ctx.moveTo(h.lx, v.ly);
						ctx.lineTo(h.rx, h.ry);

						ctx.stroke();


						this.diagramm = new Object;

						this.diagramm.height = v.by - v.ty;
						this.diagramm.width = h.rx - h.lx;
						this.diagramm.bottom = v.by;
						this.diagramm.left = v.bx;
						this.diagramm.top = v.ty;

						console.log(this.diagramm);

						console.log(this.max);
						console.log( Math.floor(Math.log(this.max)/Math.log(10)));
						this.yStep = parseInt(this.max.toString()[0])>5?Math.pow(10, Math.floor(Math.log(this.max)/Math.log(10))):Math.pow(10, Math.floor(Math.log(this.max)/Math.log(10)))/2;

						this.max0y = Math.ceil(this.max/this.yStep)*this.yStep;

						console.log(this.max0y);

						this.kY = this.diagramm.height/(1.1*this.max0y);

						ctx.fillStyle = '#666';
						var y=0;
						while (y<this.max+this.yStep)						
						{
							ctx.moveTo(this.diagramm.left-3, this.yToGy(y));
							ctx.lineTo(this.diagramm.left, this.yToGy(y));
							ctx.stroke();

							this.drawLabelLeft(y.toString(), this.diagramm.left-5, this.yToGy(y)+3);
							y += this.yStep; 
						}

						// console.log({m:this.max, k:this.kY});



						//drawing 0x labels


					},

					drawChartLabels:function(){
						//draw main label
						ctx.font="20px Georgia";
						ctx.fillStyle = '#333';

						ctx.fillText(this.inputData.labels.header, 10, 25);
						
						//
						ctx.font="16px Georgia";
						ctx.fillStyle = '#666';

						ctx.fillText(this.inputData.labels.y, (this.diagramm.left-this.inputData.labels.y.length*6)/2 , this.diagramm.top-10);

						ctx.fillText(this.inputData.labels.x, this.diagramm.left + ( this.diagramm.width - this.inputData.labels.y.length*6)/2 , this.diagramm.bottom + 20);

					},

					drawBar:function(d)
					{
						ctx.font="16px Georgia";
						ctx.beginPath();
						ctx.fillStyle = '#00aadd';
						var tx = this.diagramm.left + d.n*(this.barWidth+this.barMargin) + this.barMargin;
						var ty = this.yToGy(d.value);
						var bx = this.barWidth;
						var by = d.value*this.kY -1;
						ctx.rect(tx,ty,bx,by);
						// ctx.closePath();
						ctx.fill();
						
						ctx.fillStyle = '#666';
						ctx.fillText(d.label, tx + Math.floor( (this.barWidth - d.label.length*6)/2) , ty-20);
						ctx.fillText(d.value, tx + Math.floor( (this.barWidth - d.value.toString().length*7)/2) , ty-3);
						//console.log([bx,by,tx,ty]);
					},

					drawLabelLeft:function (str, x, y)
					{
						ctx.fillText(str, x-str.length*6, y);
					},

					yToGy:function(val)
					{
						return Math.floor(this.diagramm.height - val*this.kY) + this.diagramm.top -1; 
					},

					drawPieChart:function()
					{
					
						ctx.lineWidth = 5;
						ctx.strokeStyle = 'white';
						ctx.font="16px Georgia";
						var prevAngle = 0;

						// console.log(ctx);
						var cX = ctx.canvas.width/2;
						var cY = ctx.canvas.height/2;
						var R = 130;

						console.log(cX);
						console.log(cY);
						console.log(R);

						function drawSector(d)
						{
							var angle = prevAngle+Math.PI*2*d.percent/100;
							ctx.beginPath();
							ctx.lineWidth = 4;
							ctx.strokeStyle = 'white';
							var color = 'rgb(50,'+Math.floor(55 + d.percent*200/100) +', ' + Math.floor(200 + d.percent*55/100) +')';
							// console.log(color);
							ctx.fillStyle = color;

							ctx.arc(cX,cY,R, prevAngle, angle, 0);
							ctx.lineTo(cX, cY);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
							
							
							
							prevAngle = angle;

							ctx.beginPath();
							ctx.strokeStyle = '#ccc';
							var middle = Math.PI*d.percent/100;
							ctx.lineWidth = 2;
							ctx.moveTo(cX+80*Math.cos(prevAngle-middle), cY+80*Math.sin(prevAngle-middle));


							ctx.beginPath();
							ctx.fillStyle = '#ccc';

							ctx.arc(cX+80*Math.cos(prevAngle-middle), cY+80*Math.sin(prevAngle-middle),4, 0, 2*Math.PI, 0);
							ctx.moveTo(cX+80*Math.cos(prevAngle-middle), cY+80*Math.sin(prevAngle-middle));
							ctx.closePath();
							// ctx.lineTo(300, 200);
							// ctx.closePath();
							ctx.fill();

							// ctx.lineTo( 300+180*Math.cos(prevAngle-middle), 200+180*Math.sin(prevAngle-middle));

							if (prevAngle - middle>Math.PI )
								var lY = cY+80*Math.sin(prevAngle-middle)-30;
							else
								var lY = cY+80*Math.sin(prevAngle-middle)+30;
								
							ctx.lineTo(cX+80*Math.cos(prevAngle-middle), lY);

							ctx.fillStyle = '#666';
							if (prevAngle - middle>3*Math.PI/2 || prevAngle - middle<Math.PI/2) 
							{
								ctx.lineTo( 2*cX-10, lY);
								var str = d.label + ' ('+ Math.round(100*d.percent)/100 +'%)';
								ctx.fillText(str , 2*cX-10 - str.length*7, lY - 5);
							}
							else
							{
								ctx.lineTo( 10, lY);
								var str = d.label + ' ('+ Math.round(100*d.percent)/100 +'%)';
								ctx.fillText(str, 10, lY - 5);
							}
							console.log(prevAngle);

							ctx.stroke();
							ctx.closePath();
						}

						for (var item in  inputData)
							drawSector( {label:item, val:inputData[item], percent:100*inputData[item]/this.summ});
					}
				}

					// myPieChart = new koChart(inputData, {chartType:'pie'}); 
					// myPieChart.init();