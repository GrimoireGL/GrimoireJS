import J3Event from "./J3Event";

interface IEventArgu {
  events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void };
  data: { [key: string]: any } | any[];
  selector: string;
}

export default IEventArgu;
