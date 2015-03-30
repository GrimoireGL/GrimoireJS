module jThree.Delegates {
// ReSharper disable InconsistentNaming
    export interface Action0 {
        (): void;
    }


    export interface Action1<T1> {
        (arg1: T1): void;
    }


    export interface Action2<T1, T2> {
        (arg1: T1, arg2: T2): void;
    }


    export interface Action3<T1, T2, T3> {
        (arg1: T1, arg2: T2, arg3: T3): void;
    }


    export interface Action4<T1, T2, T3, T4> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4): void;
    }


    export interface Action5<T1, T2, T3, T4, T5> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): void;
    }


    export interface Action6<T1, T2, T3, T4, T5, T6> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): void;
    }


    export interface Action7<T1, T2, T3, T4, T5, T6, T7> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): void;
    }


    export interface Action8<T1, T2, T3, T4, T5, T6, T7, T8> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): void;
    }


    export interface Action9<T1, T2, T3, T4, T5, T6, T7, T8, T9> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): void;
    }


    export interface Func0<R> {
        (): R;
    }


    export interface Func1<T1, R> {
        (arg1: T1): R;
    }


    export interface Func2<T1, T2, R> {
        (arg1: T1, arg2: T2): R;
    }


    export interface Func3<T1, T2, T3, R> {
        (arg1: T1, arg2: T2, arg3: T3): R;
    }


    export interface Func4<T1, T2, T3, T4, R> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4): R;
    }


    export interface Func5<T1, T2, T3, T4, T5, R> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): R;
    }


    export interface Func6<T1, T2, T3, T4, T5, T6, R> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): R;
    }


    export interface Func7<T1, T2, T3, T4, T5, T6, T7, R> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): R;
    }


    export interface Func8<T1, T2, T3, T4, T5, T6, T7, T8, R> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): R;
    }


    export interface Func9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): R;
    }
// ReSharper restore InconsistentNaming
}