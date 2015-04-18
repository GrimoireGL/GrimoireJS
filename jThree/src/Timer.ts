 module jThree {
     import JThreeObject = jThree.Base.jThreeObject;

     export class Timer extends JThreeObject
     {
         constructor()
         {
             super();
         }

         protected currentFrame: number = 0;
         protected time: number = 0;
         protected timeFromLast: number = 0;

         get CurrentFrame(): number
         {
             return this.currentFrame;
         }

         get Time(): number
         {
             return this.time;
         }

         get TimeFromLast(): number
         {
             return this.timeFromLast;
         }
     }

     export class ContextTimer extends Timer
     {

         updateTimer(): void
         {
             this.currentFrame++;
             var date: number = Date.now();
             this.TimeFromLast = date - this.Time;
             this.time = date;
         }
     }
 }