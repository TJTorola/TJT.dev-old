use super::constants::{ WHITE };
use super::graph::{ Graph, Dir };
use super::process::{ Process };

pub fn hilburt() -> Process {
    let mut graph = Graph::new((0, 0), WHITE);
    graph.make_step();

    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Left);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Left);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();

    graph.into_process()
}

