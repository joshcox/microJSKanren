import {
    callWithEmptyState,
    callWithFresh,
    conj,
    disj,
    unify
} from "../src/microKanren";

// const test1 = () => callWithEmptyState(
//     conj(
//         callWithFresh(a => unify(a, "seven")),
//         callWithFresh(b => disj(
//             unify(b, "five"),
//             unify(b, "six")
//         ))
//     )
// );
//
// const test2 = () => callWithEmptyState(callWithFresh(a => unify(a, "five")));
// console.log(test2());
// const test3 = () => callWithEmptyState(callWithFresh(a => disj(unify(a, "five"), unify(a, "six"))));
// console.log(test3());

describe("microKanren", () => {
    describe("unification", () => {
        describe("when unifying two grounded values", () => {
            it("returns the input state in a stream when the values are the same", () => {
                expect(unify("a", "a")([[], 0])).toEqual([[[], 0]]);
                expect(unify("a", "a")([[[0, 1], [1, 2]], 2])).toEqual([[[[0, 1], [1, 2]], 2 ]]);
            });

            it("returns an empty stream when the values are not the same", () => {
                expect(unify("a", "b")([[], 0])).toEqual([]);
                expect(unify("a", "b")([[[0, 1], [1, 2]], 2])).toEqual([]);
            });
        });

        describe("when unifying a variable to a value", () => {
            it("returns the input state in a stream when the values match", () => {
                expect(unify(0, "a")([[[0, "a"]], 0])).toEqual([[[[0, "a"]], 0]]);
                expect(unify("a", 0)([[[0, "a"]], 0])).toEqual([[[[0, "a"]], 0]]);

                expect(unify(0, "a")([[[0, 1], [1, "a"]], 1])).toEqual([[[[0, 1], [1, "a"]], 1]]);
                expect(unify("a", 0)([[[0, 1], [1, "a"]], 1])).toEqual([[[[0, 1], [1, "a"]], 1]]);

                expect(unify(0, ["a"])([[[0, ["a"]]], 0])).toEqual([[[[0, ["a"]]], 0]]);
                expect(unify(["a"], 0)([[[0, ["a"]]], 0])).toEqual([[[[0, ["a"]]], 0]]);

                expect(unify([0], ["a"])([[[0, "a"]], 0])).toEqual([[[[0, "a"]], 0]]);
                expect(unify(["a"], [0])([[[0, "a"]], 0])).toEqual([[[[0, "a"]], 0]]);
            });

            it("extends the state when the walked values can unify", () => {
                expect(unify(0, "a")([[], 0])).toEqual([[[[0, "a"]], 0]]);
                expect(unify("a", 0)([[], 0])).toEqual([[[[0, "a"]], 0]]);

                expect(unify([0], ["a"])([[], 0])).toEqual([[[[0, "a"]], 0]]);
                expect(unify(["a"], [0])([[], 0])).toEqual([[[[0, "a"]], 0]]);
            });

            it("returns the empty stream when the walked values do not unify", () => {
                expect(unify(0, "a")([[[0, "b"]], 0])).toEqual([]);
                expect(unify("a", 0)([[[0, "b"]], 0])).toEqual([]);
            });
        });
    });

    describe("callWithFresh", () => {
        it("creates a binding with a new variable", () => {
            const g = jasmine.createSpy("goalSpy");
            const f = jasmine.createSpy("freshSpy").and.returnValue(g);
            callWithFresh(f)([[], 0]);
            expect(f).toHaveBeenCalledWith(0);
            expect(g).toHaveBeenCalledWith([[], 1]);
        });
    });
});