#[cfg(unix)]
pub mod depcheck {
macro_rules! does_package_exist {
    ($package_manager:expr, $package_manager_flags:expr, $should_grep_output:expr, $package:expr) => {
        // FIXME: this is absolutely terrible.
        if $should_grep_output {
            std::process::Command::new("sh")
                .args(["-c", format!("{} {} | grep {}", $package_manager, $package_manager_flags, $package).as_str()])
                .output()
                .expect("💀")
        } else {
            std::process::Command::new("sh")
                .args(["-c", format!("{} {} {}", $package_manager, $package_manager_flags, $package).as_str()])
                .output()
                .expect("💀")
        }
    }
}

macro_rules! file_exists_in_bin {
    ($file_to_search:expr) => {
        std::path::Path::new(&format!("/bin/{}", $file_to_search)).exists()
    }
}

enum PackageManager {
    Pacman,
    Xbps,
    Apt,
    Dnf,
    Equery,
    Unknown,
}

fn get_package_manager() -> PackageManager {
    if file_exists_in_bin!("pacman") {
        PackageManager::Pacman
    } else if file_exists_in_bin!("xbps-query") {
        PackageManager::Xbps
    } else if file_exists_in_bin!("apt") {
        PackageManager::Apt
    } else if file_exists_in_bin!("dnf") {
        PackageManager::Dnf
    } else if file_exists_in_bin!("equery") {
        PackageManager::Equery
    } else {
        PackageManager::Unknown
    }
}

pub fn runtime_dep_check() {
    /*
     * check whether gst-plugins-good and webkit2gtk packages are installed
     */
    /* packages:
     * Pacman (i use arch btw): pacman -Q
     * Void: xbps-query -l
     * Debian (apt): apt list --installed
     * Debian (dnf): dnf list installed
     * Gentoo: equery list '*'
     */
    let package_manager: PackageManager = get_package_manager();

    let command: &str;
    let args: &str;
    let mut target_gst_plugin: &str = "gst-plugins-good";
    let mut should_grep: bool = false; // because package managers suck
                                       // this will make it less accurate but eh

    // trying to make the code rather easy to maintain, at the cost of it being so long.
    // is there a more modular way to do this?
    match package_manager {
        PackageManager::Pacman => {
            command = "pacman";
            args = "-Q";
        }
        PackageManager::Xbps => {
            command = "xbps-query";
            args = "-l";
            should_grep = true;
        }
        PackageManager::Apt => {
            command = "apt";
            args = "list --installed";
            target_gst_plugin = "gstreamer1.0-plugins-good";
            should_grep = true;
        }
        PackageManager::Dnf => {
            command = "dnf";
            args = "list installed";
            target_gst_plugin = "gstreamer1.0-plugins-good";
            should_grep = true;
        }
        PackageManager::Equery => {
            command = "equery";
            args = "list '*'";
        }

        PackageManager::Unknown => todo!("consider this edge case"),
        // _ => todo!("consider this edge case")
    }

    let mut is_missing_dependencies = false;
    let mut is_tainted = false; // this flag changes if something fails.
    let gst_plugins_good = does_package_exist!(command, args, should_grep, target_gst_plugin);

    if !gst_plugins_good.stderr.is_empty() {
        eprintln!("stderr in gst-plugins-good!");
        is_tainted = true;
    }

    if gst_plugins_good.stdout.is_empty() {
        println!("does not have dependency gst-plugins-good!");
        is_missing_dependencies = true;
    } else {
        println!("has dependency gst-plugins-good!")
    }

    if is_missing_dependencies == true {
        eprintln!("you are missing dependencies!");
        let a = std::process::Command::new("sh")
            .args(["-c", "notify-send 'Cazic: You are missing a dependency! Audioplayer may not work without gst_plugins_good installed!'", "--urgency=critical"])
            .output()
            .unwrap();
        dbg!(a); // don't touch this code. you need it for notify-send to work (???)
    } else {
        println!("has all dependencies!");
    }
    if is_tainted == true {
        eprintln!("taint is true; some commands failed to run.");
    }
}
}
