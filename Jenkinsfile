node {
    checkout scm

    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
        def customImage = docker.build("wildfly8/mkt2")
		customImage.push()
    }
}