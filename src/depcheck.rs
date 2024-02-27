#[cfg(unix)]
pub mod unix_depcheck {
macro_rules! does_package_exist {
    ($package_manager:expr, $package_manager_flags:expr, $should_grep_output:expr, $package:expr) => {
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
    /* packages:
     * Arch (pacman) (i use arch btw): pacman -Q
     * Void (xbps): xbps-query -l
     * Debian (apt): apt list --installed
     * Debian (dnf): dnf list installed
     * Gentoo (emerge): equery list '*'
     */
    let package_manager = get_package_manager();

    let command: &str;
    let args: &str;
    let mut target_gst_plugin: &str = "gst-plugins-good";
    let mut should_grep: bool = false; // because package managers suck
                                       // this will make it less accurate but eh

    // trying to make the code rather easy to maintain, at the cost of it being so long.
    // is there a more modular way to do this?
    match package_manager {
        PackageManager::Pacman => (command, args) = ("pacman", "-Q"),
        PackageManager::Xbps => (command, args, should_grep) = ("xbps-query", "-l", true),
        PackageManager::Apt => (command, args, target_gst_plugin, should_grep) = ("apt", "list --installed", "gstreamer1.0-plugins-good", true),
        PackageManager::Dnf => (command, args, target_gst_plugin, should_grep) = ("dnf", "list installed", "gstreamer1.0-plugins-good", true),
        PackageManager::Equery => (command, args) = ("equery", "list gst-plugins-good"),
        PackageManager::Unknown => return /* give up */,
    }

    let gst_plugins_good = does_package_exist!(command, args, should_grep, target_gst_plugin);

    if gst_plugins_good.stdout.is_empty() {
        eprintln!("does not have dependency gst-plugins-good!");
        std::process::Command::new("sh")
            .args(["-c", "notify-send 'Cazic: You are missing a dependency! Audioplayer may not work without gst_plugins_good installed!'", "--urgency=critical"])
            .output()
            .unwrap();
    } else {
        println!("has dependency gst-plugins-good!")
    }
}
}
