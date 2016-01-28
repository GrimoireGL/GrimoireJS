// The interfaces to represent the types similar to "delegate" in C#.
// You can use these class like these reference below.
// Action Delegate: https://msdn.microsoft.com/en-us/library/system.action%28v=vs.110%29.aspx
// Func Delegate:https://msdn.microsoft.com/en-us/library/bb534960%28v=vs.110%29.aspx
// ReSharper disable InconsistentNaming
interface Action0 {
  (): void;
}


interface Action1<T1> {
  (arg1: T1): void;
}


interface Action2<T1, T2> {
  (arg1: T1, arg2: T2): void;
}


interface Action3<T1, T2, T3> {
  (arg1: T1, arg2: T2, arg3: T3): void;
}


interface Action4<T1, T2, T3, T4> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4): void;
}


interface Action5<T1, T2, T3, T4, T5> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): void;
}


interface Action6<T1, T2, T3, T4, T5, T6> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): void;
}


interface Action7<T1, T2, T3, T4, T5, T6, T7> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): void;
}


interface Action8<T1, T2, T3, T4, T5, T6, T7, T8> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): void;
}


interface Action9<T1, T2, T3, T4, T5, T6, T7, T8, T9> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): void;
}


interface Func0<R> {
  (): R;
}


interface Func1<T1, R> {
  (arg1: T1): R;
}


interface Func2<T1, T2, R> {
  (arg1: T1, arg2: T2): R;
}


interface Func3<T1, T2, T3, R> {
  (arg1: T1, arg2: T2, arg3: T3): R;
}


interface Func4<T1, T2, T3, T4, R> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4): R;
}


interface Func5<T1, T2, T3, T4, T5, R> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): R;
}


interface Func6<T1, T2, T3, T4, T5, T6, R> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): R;
}


interface Func7<T1, T2, T3, T4, T5, T6, T7, R> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): R;
}


interface Func8<T1, T2, T3, T4, T5, T6, T7, T8, R> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): R;
}


interface Func9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> {
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): R;
}
// ReSharper restore InconsistentNaming

export {
  Action0,
  Action1,
  Action2,
  Action3,
  Action4,
  Action5,
  Action6,
  Action7,
  Action8,
  Action9,
  Func0,
  Func1,
  Func2,
  Func3,
  Func4,
  Func5,
  Func6,
  Func7,
  Func8,
  Func9,
};
