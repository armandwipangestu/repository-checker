// Menggunakan jQuery

const ogIoApiKey = "3fe266f9-a6f8-4484-a8cf-eda88fe9495e";

$.ajax({
    url: 'https://api.github.com/users/armandwipangestu',
    success: results => {
        let author = '';
        author += showAuthor(results);
        $('.author').html(author);
    },
    error: (e) => {
        let author = '';
        author += (e.responsText);
        $('.author').html(author);
    }
});
// $('#search-button').hide();
$('.search-button').on('click', function () {

    // $('.input-keyword').on('keyup', function() {

    $.ajax({
        url: 'https://api.github.com/users/' + $('.input-keyword').val(),
        success: results => {
            let info = '';
            info += showUser(results);
            $('.user').html(info);

            // Tampilkan detail repository
            $.ajax({
                url: "https://api.github.com/users/" + $('.input-keyword').val() + "/repos",
                success: results => {
                    let repos = '';
                    results.forEach(r => {
                        repos += showRepos(r);
                    });
                    $('.show-card').html(repos);

                    // Ketika tombil show details di klik
                    $('.modal-detail-button').on('click', function () {
                        $.ajax({
                            url: 'https://api.github.com/repos/' + $(this).data('repo'),
                            success: rd => {
                                const repoDetail = showRepoDetails(rd);
                                const encodeURLCompDetails = encodeURIComponent(`https://github.com/${rd.full_name}`);
                                // console.log(encodeURLComp);
                                $.ajax({

                                    // url: "https://opengraph.io/api/1.1/site/https%3A%2F%2Fwww.github.com%2Fxshin404%2FmyTermux\?accept_lang\=auto\&app_id\=3fe266f9-a6f8-4484-a8cf-eda88fe9495e",
                                    url: `https://opengraph.io/api/1.1/site/${encodeURLCompDetails}?app_id=${ogIoApiKey}`,
                                    success: results => {
                                        const opengraph = showOGDetail(results.openGraph.image.url);
                                        $('.gambar-detail').html(opengraph);
                                    },
                                    error: (e) => {
                                        console.log(e.responsText);
                                    }
                                })
                                $('.modal-body').html(repoDetail);
                            },
                            error: (e) => {
                                console.log(e.responsText);
                            }
                        });
                    });

                },
                error: e => { console.log(e.responseText); }
            });
        },
        error: () => {
            Swal.fire({
                icon: 'error',
                title: 'Opsss...',
                html: '<i class="fab fa-github"></i> : User <b>' + $('.input-keyword').val() + '</b> not found!!!',
            })
        }
    });

});

function showAuthor(author) {
    return `
        <p>Created by <a href="${author.html_url}" style="text-decoration: none">${author.name}</a> made with <i class="fas fa-heart text-danger"></i>
    `;
}

function showUser(user) {
    return `
        <a href="${user.avatar_url}" target="_blank" rel="noopener"><img src="${user.avatar_url}" alt="hero" style="width: 200px;" class="rounded-circle" id="hero"></a>
        <h1 class="mt-3">${user.login}</h1>
        <h4 class="text-muted">${user.name}</h4>
        <p class="lead">${user.bio ? `${user.bio}` : 'No Bio'}</p>
        <p>
            <i class="fas fa-heart text-danger me-1"></i> <span class="text-white me-2">${user.followers} Followers</span>
            <i class="fas fa-user-friends text-primary me-1"></i> <span class="text-white me-2">${user.following} Following</span>
            <i class="fas fa-folder-open text-warning me-1"></i> <span class="text-white">${user.public_repos} Public Repository</span>
        </p>
        <div class="readme mb-4">
            <a href="https://github-readme-stats.vercel.app/api?username=${user.login}&amp;count_private=true&amp;show_icons=true&amp;include_all_commits=true&amp;theme=dracula" class="me-2" target="_blank" rel="noopener"><img class="img-fluid" src="https://github-readme-stats.vercel.app/api?username=${user.login}&amp;count_private=true&amp;show_icons=true&amp;include_all_commits=true&amp;theme=dracula" alt="GitHub Stats" /></a>
            <a href="https://github-readme-stats.vercel.app/api/top-langs/?username=${user.login}&amp;layout=compact&amp;theme=dracula" target="_blank" rel="noopener"><img class="img-fluid mt-4" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${user.login}&amp;layout=compact&amp;theme=dracula" alt="GitHub Most Used Language" /></a>
        </div>
    `;
}

function showRepos(repos) {
    return `
      <div class="col">
        <div class="card h-100 text-dark bg-white">
          <!--<div class="gambar">
            ${showOGio(repos.full_name)}
          </div>-->
          ${showOGio(repos.full_name)}
          <div class="card-body">
            <h5 class="card-title"><i class="fas fa-folder-open me-1 mb-2 text-dark"></i>${repos.full_name}</h5> 
            <span><strong><i class="fas fa-code-branch me-1 text-dark"></i> ${repos.forks_count}</strong></span> 
            <span><strong><i class="fas fa-star" style="color: #ebbc21;"></i> ${repos.stargazers_count}</strong></span>
            <img class="ms-2" src="https://badges.pufler.dev/visits/${repos.full_name}?"/>
            <p class="card-text mb-2 mt-2"><i class="fas fa-bookmark text-dark me-1"></i>${repos.description ? `${repos.description}` : 'No Description'}</p>
          </div>
          <div class="card-footer text-end">
            <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#repoDetailModal" data-repo="${repos.full_name}">
              Show Details 
              <!--<i class="fas fa-eye ms-1"></i>-->
              <i class="fas fa-sign-in-alt ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    `;
}

function showOGio(userRepo) {
    const encodeURLCompRepo = encodeURIComponent(`https://github.com/${userRepo}`);
    $.ajax({
        // url: "https://opengraph.io/api/1.1/site/https%3A%2F%2Fwww.github.com%2Fxshin404%2FmyTermux\?accept_lang\=auto\&app_id\=3fe266f9-a6f8-4484-a8cf-eda88fe9495e",
        url: `https://opengraph.io/api/1.1/site/${encodeURLCompRepo}?app_id=${ogIoApiKey}`,
        success: results => {
            const image = `<a href="${results.openGraph.image.url}" target="_blank" rel="noopener"><img src="${results.openGraph.image.url}" class="card-img-top img-fluid" /></a>`;
            return `
                ${$('.card').html(image)}
            `
        },
        error: (e) => {
            console.log(e.responsText);
        }
    })
}

function showRepoDetails(repodetail) {
    return `
    <div class="container-fluid bg-light">
        <div class="gambar-detail mb-2">

         </div>
        <ul class="list-group">
            <li class="list-group-item bg-dark text-white"><strong>Repository Name<br><i class="fas fa-folder-open me-1 text-warning"></i></strong>${repodetail.full_name}</li>
            <li class="list-group-item bg-dark text-white"><strong>Forks Count<br><i class="fas fa-code-branch me-1 text-secondary"></i></strong> ${repodetail.forks_count} </li>
            <li class="list-group-item bg-dark text-white"><strong>Stargazers Count<br><i class="fas fa-star me-1" style="color: #ebbc21;"></i></strong>${repodetail.stargazers_count} </li>
            <li class="list-group-item bg-dark text-white"><strong>Open Issues<br><i class="fas fa-exclamation-triangle me-1" style="color: red;"></i></strong>${repodetail.open_issues} </li>
            <li class="list-group-item bg-dark text-white"><strong>Highest Percentage Language<br><i class="fas fa-file-code me-1 text-secondary"></i></strong>${repodetail.language ? `${repodetail.language}` : "Can't detect Language"}</li>
            <li class="list-group-item bg-dark text-white"><strong>Description<br><i class="fas fa-bookmark me-1 text-success"></i></strong> ${repodetail.description ? `${repodetail.description}` : 'No Description'}</li>
            <li class="list-group-item bg-dark text-white"><img src="https://badges.pufler.dev/visits/${repodetail.full_name}?"/></li>
            <li class="list-group-item bg-dark text-white"><strong>Watcher Count<br><i class="fas fa-eye me-1"></i></strong>${repodetail.subscribers_count} </li>
            <li class="list-group-item bg-dark text-white"><strong>License<br><i class="fas fa-id-badge me-1"></i></strong> ${repodetail.license ? `${repodetail.license.name}` : 'No License'}</li>
            <li class="list-group-item bg-dark text-white"><strong>Repository Size<br><i class="fas fa-balance-scale me-1"></i></strong>${Math.floor(repodetail.size / 1024)} <strong>MB</strong></li>
            <li class="list-group-item bg-dark text-white"><strong>Created at<br><i class="fas fa-calendar-plus me-1"></i></strong>${repodetail.created_at}</li>
            <li class="list-group-item bg-dark text-white"><strong>Updated at<br><i class="fas fa-calendar-alt me-1"></i></strong>${repodetail.updated_at}</li>
            <li class="list-group-item bg-dark text-white"><strong>Contributors<br><i class="fas fa-users me-1"></i></strong><br><br> <a href="https://github.com/${repodetail.full_name}/graphs/contributors"><img src="https://contrib.rocks/image?repo=${repodetail.full_name}" /></a></li>
        </ul>
    </div>
    <div class="modal-footer">
        <a href="https://github.com/${repodetail.full_name}"><button type="button" class="btn btn-primary">See on <i class="ms-1 fab fa-github"></i></button></a>
    </div>`;
}

function showOGDetail(image) {

    return `
        <a href="${image}" target="_blank" rel="noopener">
            <img src="${image}" class="img-fluid">
        </a>
    `

}
