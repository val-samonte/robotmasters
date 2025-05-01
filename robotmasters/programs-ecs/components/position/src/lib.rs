use bolt_lang::*;

declare_id!("FsU2K4WV7xvzZWLQvc7H1jZdXxXmQ7MrzufvyWipdZbx");

#[component]
#[derive(Default)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}